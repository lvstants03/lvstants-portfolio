"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

const handleSmoothScroll = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const offset = 90;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

export default function Header({ activeSection = "home", onNavigate }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigationItems = [
    { id: "home", name: t("nav.home", { defaultValue: "Home" }) },
    { id: "introduce", name: t("nav.about", { defaultValue: "About" }) },
    { id: "skills", name: t("nav.skills", { defaultValue: "Skills" }) },
    { id: "projects", name: t("nav.projects", { defaultValue: "Projects" }) },
    { id: "certificates", name: t("nav.certificates", { defaultValue: "Credentials" }) },
    { id: "experience", name: t("nav.experience", { defaultValue: "Experience" }) }
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setMobileMenuOpen(false);
  };

  if (!mounted) {
    return (
      <header className="fixed top-4 left-0 right-0 z-[100] px-4 max-w-5xl mx-auto opacity-0">
        <div className="h-14 rounded-full bg-zinc-950/80 border border-zinc-800" />
      </header>
    );
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-[100] px-4 max-w-5xl mx-auto">
      <div
        className={`w-full rounded-full transition-all duration-300 backdrop-blur-2xl border flex items-center justify-between px-3 sm:px-4 py-2 ${
          scrolled
            ? "bg-zinc-950/90 border-yellow-500/20 shadow-2xl shadow-black/80"
            : "bg-zinc-950/75 border-zinc-800/80 shadow-xl shadow-black/40"
        }`}
      >
        {/* Brand Monogram */}
        <Link href="/" className="relative z-[110]">
          <div
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => {
              if (isHomePage) handleSmoothScroll("home");
              setMobileMenuOpen(false);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-400 p-[1px] shadow-sm">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                <span className="text-[11px] font-black text-yellow-400 font-mono tracking-tighter">LM</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight text-white uppercase leading-none">
                LÝ VĂN <span className="text-yellow-400">MỸ</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-mono tracking-wider uppercase hidden sm:block">
                Software Engineer
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Pills */}
        {isHomePage && (
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/60 p-1 rounded-full">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleSmoothScroll(item.id);
                    onNavigate?.(item.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 relative cursor-pointer ${
                    isActive
                      ? "text-zinc-950 font-bold"
                      : "text-zinc-400 hover:text-zinc-200 font-normal"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeFloatingTab"
                      className="absolute inset-0 bg-yellow-400 rounded-full shadow-md shadow-yellow-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Action: Language Switcher & Mobile Hamburger */}
        <div className="flex items-center gap-2 relative z-[110]">
          {/* Language Toggle Pill */}
          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 p-0.5 rounded-full">
            <button
              onClick={() => toggleLanguage("vi")}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                i18n.language === "vi"
                  ? "bg-yellow-400 text-zinc-950 shadow-sm font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Flag code="vn" className="w-3.5 h-2.5 object-cover rounded-[1px]" />
              <span>VI</span>
            </button>

            <button
              onClick={() => toggleLanguage("en")}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                i18n.language === "en"
                  ? "bg-yellow-400 text-zinc-950 shadow-sm font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Flag code="us" className="w-3.5 h-2.5 object-cover rounded-[1px]" />
              <span>EN</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          {isHomePage && (
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center bg-zinc-900/80 border border-zinc-800 rounded-full text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-yellow-400" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isHomePage && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 shadow-2xl z-[100] lg:hidden space-y-4"
          >
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleSmoothScroll(item.id);
                    onNavigate?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-2xl text-left text-sm font-mono font-semibold uppercase tracking-wider flex items-center justify-between transition-colors ${
                    activeSection === item.id
                      ? "bg-yellow-400 text-zinc-950 font-bold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                  {activeSection === item.id && <span className="w-2 h-2 rounded-full bg-zinc-950" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}