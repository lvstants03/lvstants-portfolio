import { Inter, Cormorant_Garamond } from "next/font/google";
import Footer from "../view/Footer";
import { Metadata } from "next";
import Header from "@/view/Header";
import AmbientSoundPlayer from "@/components/AmbientSoundPlayer";
import VoiceAIAssistant from "@/components/VoiceAIAssistant";
import HandGestureScroll from "@/components/HandGestureScroll";
import '../styles/globals.css';
import I18nProvider from "@/config/i18/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: 'swap',
});

// Link mShots đã được mã hóa chuẩn
const shareImage = "https://s.wordpress.com/mshots/v1/https%3A%2F%2Flvstants-portfolio.vercel.app%2F?w=1200&h=630";

export const metadata: Metadata = {
  title: {
    default: "Lý Văn Mỹ | Full-stack Developer & Software Engineer",
    template: "%s | Lý Văn Mỹ"
  },
  description: "Lý Văn Mỹ (LVSTANTS) - Chuyên gia phát triển Full-stack với kinh nghiệm về MERN Stack, Next.js, NestJS và hệ thống .NET.",
  generator: 'lvstants.dev',
  keywords: ["Lý Văn Mỹ", "LVSTANTS", "Fullstack Developer", "Software Engineer", "MERN Stack", "Next.js", "NestJs"],
  authors: [{ name: "Lý Văn Mỹ", url: "https://lvstants-portfolio.vercel.app" }],
  metadataBase: new URL('https://lvstants-portfolio.vercel.app'),
  alternates: {
    canonical: '/',
  },

  // Cấu hình robots để bot có thể index và quét ảnh
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  openGraph: {
    title: "Lý Văn Mỹ | Portfolio - Full-stack Developer",
    description: "Khám phá các dự án công nghệ và kỹ năng lập trình Full-stack của Lý Văn Mỹ.",
    url: "https://lvstants-portfolio.vercel.app",
    siteName: "Lý Văn Mỹ Portfolio",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
        alt: "Lý Văn Mỹ Portfolio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lý Văn Mỹ | Full-stack Developer",
    images: [shareImage],
  },

  other: {
    'og:image:secure_url': shareImage,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${cormorant.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-body bg-black antialiased" suppressHydrationWarning>
        <I18nProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <AmbientSoundPlayer />
          <HandGestureScroll />
          <VoiceAIAssistant />
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}