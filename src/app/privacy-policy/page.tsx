import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | Privacy Policy",
  description:
    "Chính sách bảo mật của portfolio Lý Văn Mỹ: dữ liệu thu thập, mục đích sử dụng và quyền của bạn. Privacy Policy of Ly Van My's portfolio.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <LegalDocument docKey="privacy" />;
}
