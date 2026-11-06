"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Facebook,
  Github,
  HelpCircle,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import homeData from "@/data/home.json";

interface FaqItem {
  q: string;
  a: string;
}

export default function ContactPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="min-h-screen bg-[#09090b]" />;
  }

  const c = "contact";
  const faqRaw = t(`${c}.faq.items`, { returnObjects: true }) as unknown;
  const faqItems: FaqItem[] = Array.isArray(faqRaw) ? (faqRaw as FaqItem[]) : [];

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // Trinh duyet khong ho tro clipboard -> bo qua
    }
  };

  const infoItems = [
    { key: "email", icon: Mail, label: t(`${c}.info.email`), value: homeData.email, href: `mailto:${homeData.email}`, copyable: true },
    { key: "phone", icon: Phone, label: t(`${c}.info.phone`), value: homeData.phone, href: `tel:${homeData.phone}`, copyable: true },
    { key: "location", icon: MapPin, label: t(`${c}.info.location`), value: homeData.location, href: undefined, copyable: false },
    { key: "response", icon: Clock, label: t(`${c}.info.response`), value: t(`${c}.info.response_value`), href: undefined, copyable: false },
  ];

  const socials = [
    { key: "github", icon: Github, href: homeData.github, label: "GitHub" },
    { key: "linkedin", icon: Linkedin, href: homeData.linkedin, label: "LinkedIn" },
    { key: "facebook", icon: Facebook, href: homeData.facebook, label: "Facebook" },
  ];

  return (
    <main className="min-h-screen pt-28 md:pt-36 pb-20 bg-[#09090b] text-zinc-100 relative selection:bg-yellow-500/20 selection:text-yellow-400 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-yellow-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10 space-y-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t(`${c}.badge`)}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              <span>{t(`${c}.available`)}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {t(`${c}.title_lead`)} <span className="text-yellow-400">{t(`${c}.title_highlight`)}</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">{t(`${c}.description`)}</p>
        </motion.div>

        {/* Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-yellow-400" />
                <span>{t(`${c}.info.heading`)}</span>
              </div>

              <ul className="space-y-3">
                {infoItems.map(({ key, icon: Icon, label, value, href, copyable }) => (
                  <li
                    key={key}
                    className="group flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</span>
                      {href ? (
                        <a href={href} className="block text-sm text-zinc-200 hover:text-yellow-400 transition-colors truncate">
                          {value}
                        </a>
                      ) : (
                        <span className="block text-sm text-zinc-200 truncate">{value}</span>
                      )}
                    </div>
                    {copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(key, value)}
                        aria-label={copied === key ? t(`${c}.info.copied`) : t(`${c}.info.copy`)}
                        title={copied === key ? t(`${c}.info.copied`) : t(`${c}.info.copy`)}
                        className="w-8 h-8 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/40 flex items-center justify-center text-zinc-400 hover:text-yellow-400 transition-all cursor-pointer shrink-0"
                      >
                        {copied === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t border-zinc-800/70">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
                  {t(`${c}.info.socials`)}
                </span>
                <div className="flex items-center gap-2">
                  {socials.map(({ key, icon: Icon, href, label }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/40 flex items-center justify-center text-zinc-400 hover:text-yellow-400 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* FAQ */}
        {faqItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-yellow-400" />
              <span>{t(`${c}.faq.heading`)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {faqItems.map((item, idx) => (
                <details
                  key={idx}
                  className="group p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 open:border-yellow-500/30 transition-colors"
                >
                  <summary className="flex items-start justify-between gap-3 cursor-pointer list-none text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5 transition-transform group-open:rotate-180 group-open:text-yellow-400" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
