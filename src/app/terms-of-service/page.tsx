import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | Terms of Service",
  description:
    "Điều khoản dịch vụ khi sử dụng portfolio Lý Văn Mỹ. Terms of Service for using Ly Van My's portfolio website.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return <LegalDocument docKey="terms" />;
}
