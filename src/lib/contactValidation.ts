// Bo validation dung chung cho ContactForm (client) va /api/contact (server)

export const CONTACT_SUBJECTS = ["hiring", "freelance", "collaboration", "other"] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export interface ContactPayload {
  name: string;
  email: string;
  subject: ContactSubject | "";
  message: string;
  // Honeypot: truong an, nguoi that se de trong
  website?: string;
}

// Gia tri la i18n key con trong namespace "contact.form.errors"
export type ContactErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 60,
  messageMin: 10,
  messageMax: 2000,
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeContactPayload(input: Partial<ContactPayload>): ContactPayload {
  return {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim().toLowerCase(),
    subject: (String(input.subject ?? "").trim() as ContactSubject | ""),
    message: String(input.message ?? "").trim(),
    website: String(input.website ?? "").trim(),
  };
}

export function validateContact(payload: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};

  if (!payload.name) {
    errors.name = "name_required";
  } else if (payload.name.length < CONTACT_LIMITS.nameMin || payload.name.length > CONTACT_LIMITS.nameMax) {
    errors.name = "name_length";
  }

  if (!payload.email) {
    errors.email = "email_required";
  } else if (!EMAIL_REGEX.test(payload.email) || payload.email.length > 254) {
    errors.email = "email_invalid";
  }

  if (!payload.subject) {
    errors.subject = "subject_required";
  } else if (!CONTACT_SUBJECTS.includes(payload.subject as ContactSubject)) {
    errors.subject = "subject_invalid";
  }

  if (!payload.message) {
    errors.message = "message_required";
  } else if (
    payload.message.length < CONTACT_LIMITS.messageMin ||
    payload.message.length > CONTACT_LIMITS.messageMax
  ) {
    errors.message = "message_length";
  }

  return errors;
}
