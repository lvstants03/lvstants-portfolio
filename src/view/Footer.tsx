"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Facebook } from "lucide-react";
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

  return (
    <footer className="relative bg-[#09090b] border-t border-zinc-900 pt-16 pb-12 overflow-hidden text-zinc-100">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 items-start">
          
          {/* Brand Info (Col 6) */}
          <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-400 p-[1px] shadow-sm">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                  <span className="text-[10px] font-black text-yellow-400 font-mono tracking-tighter">LV</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white uppercase leading-none group-hover:text-yellow-400 transition-colors font-mono">
                  LVSTANTS<span className="text-yellow-400">.</span>
                </span>
                <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase mt-0.5">
                  Lý Văn Mỹ • Software Engineer
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs font-normal">
              {renderContent(`${f}.bio`, "Building scalable enterprise architectures, distributed backend microservices and high-performance web systems.")}
            </p>
            
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href={homeData.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub" 
                className="p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href={homeData.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                className="p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={homeData.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={`mailto:${homeData.email}`} 
                className="p-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all" 
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sitemap (Col 3) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-4 block">
              {renderContent(`${f}.sitemap`, "Sitemap")}
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about-us" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  {renderContent(`${f}.links.about`, "About Me")}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  {renderContent(`${f}.links.projects`, "Projects")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  {renderContent(`${f}.links.contact`, "Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal (Col 3) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-4 block">
              {renderContent(`${f}.legal`, "Legal & Community")}
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/privacy-policy" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  {renderContent(`${f}.links.privacy`, "Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  {renderContent(`${f}.links.terms`, "Terms of Service")}
                </Link>
              </li>
              <li>
                <Link href="/community-us" className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  {renderContent(`${f}.links.community`, "Community")}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-mono text-zinc-400">
          <p suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {isVi ? "LÝ VĂN MỸ" : "LY VAN MY"} — {renderContent(`${f}.all_rights`, "TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU")}
          </p>
          
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span>
              {renderContent(`${f}.developed_by`, "Phát triển & Thiết kế bởi")} <span className="text-yellow-400 font-semibold">LVSTANTS</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}