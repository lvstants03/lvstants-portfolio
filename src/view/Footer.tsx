"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, Facebook, ArrowUpRight, ArrowUp, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import homeData from "@/data/home.json";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const f = "footer";

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderContent = (key: string, defaultValue = "") => {
    return mounted ? t(key, { defaultValue }) : defaultValue;
  };

  const isVi = i18n.language === "vi";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#09090b] border-t border-zinc-900/80 pt-8 md:pt-12 pb-28 sm:pb-16 text-zinc-100 font-sans">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Top Call-To-Action Glass Banner */}
        <div className="relative rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-6 sm:p-8 mb-12 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isVi ? "Sẵn sàng nhận dự án mới" : "Available for new projects"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {isVi ? "Cùng nhau hiện thực hóa ý tưởng của bạn?" : "Let's build something exceptional together"}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-normal leading-relaxed">
                {isVi 
                  ? "Tư vấn kiến trúc hệ thống, phát triển giải pháp Full-stack và tối ưu hiệu năng ứng dụng quy mô lớn." 
                  : "Architectural consulting, full-stack engineering & high-impact enterprise solutions."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${homeData.email}`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-zinc-950 font-semibold text-xs tracking-tight flex items-center gap-2 shadow-md hover:shadow-yellow-500/20 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>{isVi ? "Bắt đầu trao đổi" : "Get in Touch"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href={homeData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs tracking-tight transition-all duration-200 cursor-pointer"
              >
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-12 border-b border-zinc-900">
          
          {/* Brand Info & Socials (Col 6) */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center relative shadow-sm group-hover:border-yellow-500/50 transition-colors">
                <Image
                  src="/logo.png"
                  alt="LVSTANTS Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white uppercase leading-none group-hover:text-yellow-400 transition-colors">
                  LVSTANTS<span className="text-yellow-400">.</span>
                </span>
                <span className="text-xs text-zinc-400 font-medium tracking-normal mt-1">
                  Lý Văn Mỹ • Software Engineer
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              {renderContent(`${f}.bio`, "Chuyên gia phát triển phần mềm toàn diện, kiến trúc microservices phân tán và hệ thống web hiệu năng cao.")}
            </p>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                <span>{homeData.location}</span>
              </span>
              <a 
                href={`mailto:${homeData.email}`} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium hover:border-yellow-500/40 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-yellow-400" />
                <span>{homeData.email}</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a 
                href={homeData.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub" 
                className="w-9 h-9 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/40 flex items-center justify-center text-zinc-400 hover:text-yellow-400 transition-all duration-200"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href={homeData.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="w-9 h-9 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/40 flex items-center justify-center text-zinc-400 hover:text-yellow-400 transition-all duration-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={homeData.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="w-9 h-9 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/40 flex items-center justify-center text-zinc-400 hover:text-yellow-400 transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns (Col 6) - Lưới 2 cột đều đặn font Inter */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8 sm:gap-10">
            {/* Sitemap Links */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4 block">
                {renderContent(`${f}.sitemap`, "Điều hướng")}
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/about-us" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium block py-0.5">
                    {renderContent(`${f}.links.about`, "Giới thiệu")}
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium block py-0.5">
                    {renderContent(`${f}.links.projects`, "Dự án")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium block py-0.5">
                    {renderContent(`${f}.links.contact`, "Liên hệ")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Platform Links */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4 block">
                {renderContent(`${f}.legal`, "Pháp lý & Hệ thống")}
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium block py-0.5">
                    {renderContent(`${f}.links.privacy`, "Chính sách bảo mật")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium block py-0.5">
                    {renderContent(`${f}.links.terms`, "Điều khoản dịch vụ")}
                  </Link>
                </li>
                <li>
                  <Link href="/community-us" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium block py-0.5">
                    {renderContent(`${f}.links.community`, "Cộng đồng")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar Strip */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-normal text-zinc-500">
          <p suppressHydrationWarning className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {isVi ? "LÝ VĂN MỸ" : "LY VAN MY"}. {renderContent(`${f}.all_rights`, "TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU.")}
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/40 text-zinc-400 hover:text-yellow-400 transition-all cursor-pointer group flex items-center gap-1.5"
            aria-label="Back to top"
            title={isVi ? "Lên đầu trang" : "Back to top"}
          >
            <span className="text-xs text-zinc-400 group-hover:text-yellow-400">{isVi ? "Lên đầu trang" : "Back to top"}</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}