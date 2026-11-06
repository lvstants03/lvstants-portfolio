import { NextRequest, NextResponse } from "next/server";
import homeData from "@/data/home.json";
import {
  ContactPayload,
  normalizeContactPayload,
  validateContact,
} from "@/lib/contactValidation";

// Rate limit don gian trong bo nho: toi da 3 request / 60s / IP
// Luu y: tren moi truong serverless, bo nho co the bi reset giua cac instance.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitStore.get(ip) ?? []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateLimitStore.set(ip, hits);
  return false;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const SUBJECT_LABELS: Record<string, string> = {
  hiring: "Tuyen dung / Hiring",
  freelance: "Freelance",
  collaboration: "Hop tac / Collaboration",
  other: "Khac / Other",
};

export async function POST(req: NextRequest) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, code: "INVALID_JSON" }, { status: 400 });
  }

  const payload = normalizeContactPayload(body);

  // Honeypot: bot dien vao truong an -> tra ve thanh cong gia, khong gui mail
  if (payload.website) {
    return NextResponse.json({ success: true });
  }

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, code: "VALIDATION_ERROR", errors }, { status: 422 });
  }

  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json({ success: false, code: "RATE_LIMITED" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, code: "MAIL_NOT_CONFIGURED" }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || homeData.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  const subjectLabel = SUBJECT_LABELS[payload.subject] ?? payload.subject;

  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${subjectLabel}`,
    "",
    payload.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `[Portfolio] ${subjectLabel} - ${payload.name}`,
        text,
      }),
    });

    if (!res.ok) {
      console.error("Resend API error:", res.status, await res.text());
      return NextResponse.json({ success: false, code: "SEND_FAILED" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact send error:", error);
    return NextResponse.json({ success: false, code: "SEND_FAILED" }, { status: 502 });
  }
}
