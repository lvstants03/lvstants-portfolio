import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ | Contact",
  description:
    "Liên hệ Lý Văn Mỹ cho cơ hội tuyển dụng, dự án freelance hoặc hợp tác. Get in touch with Ly Van My for hiring, freelance or collaboration.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
