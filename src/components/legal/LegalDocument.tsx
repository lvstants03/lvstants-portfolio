"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, CalendarClock, ListTree, Mail, Scale, ShieldCheck } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export type LegalDocKey = "privacy" | "terms";

interface LegalSection {
  id: string;
  heading: string;
  body?: string[];
  bullets?: string[];
}

interface LegalDocumentProps {
  docKey: LegalDocKey;
}

export default function LegalDocument({ docKey }: LegalDocumentProps) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const base = `legal.${docKey}`;
  const sections = useMemo<LegalSection[]>(() => {
    if (!mounted) return [];
    const raw = t(`${base}.sections`, { returnObjects: true }) as unknown;
    return Array.isArray(raw) ? (raw as LegalSection[]) : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, base, t, i18n.language]);

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const activeId = useScrollSpy(sectionIds, 140);

  if (!mounted) {
    return <main className="min-h-screen bg-[#09090b]" />;
  }

  const Icon = docKey === "privacy" ? ShieldCheck : Scale;

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  };

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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("legal.common.back_home")}</span>
          </Link>

          <div className="flex">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Icon className="w-3.5 h-3.5" />
              <span>{t(`${base}.badge`)}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {t(`${base}.title_lead`)} <span className="text-yellow-400">{t(`${base}.title_highlight`)}</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">{t(`${base}.description`)}</p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
            <CalendarClock className="w-3.5 h-3.5 text-yellow-400" />
            <span>
              {t("legal.common.updated_label")}: <span className="text-zinc-200">{t("legal.common.updated_date")}</span>
            </span>
          </div>
        </motion.div>

        {/* Body: TOC + Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* TOC sticky */}
          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-28">
            <nav
              aria-label={t("legal.common.toc")}
              className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
                <ListTree className="w-4 h-4 text-yellow-400" />
                <span>{t("legal.common.toc")}</span>
              </div>
              <ol className="space-y-1">
                {sections.map((s, idx) => {
                  const isActive = activeId === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => handleTocClick(e, s.id)}
                        className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
                          isActive
                            ? "bg-yellow-400/10 border-yellow-500/20 text-yellow-400"
                            : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                        }`}
                      >
                        <span className="font-mono text-[10px] mt-0.5 opacity-70">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="font-medium">{s.heading}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          {/* Sections */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5">
            {sections.map((s, idx) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="scroll-mt-28 p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors backdrop-blur-sm space-y-3"
              >
                <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-white tracking-tight">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-500/20 rounded">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>

                {s.body?.map((p, i) => (
                  <p key={`p-${i}`} className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {p}
                  </p>
                ))}

                {s.bullets && s.bullets.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {s.bullets.map((b, i) => (
                      <li key={`b-${i}`} className="flex items-start gap-2.5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}

            {/* CTA */}
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{t("legal.common.cta_title")}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm">{t("legal.common.cta_desc")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-yellow-500/10"
                >
                  <Mail className="w-4 h-4" />
                  <span>{t("legal.common.cta_button")}</span>
                </Link>
                <Link
                  href={t(`${base}.related_href`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs transition-colors group"
                >
                  <span>
                    {t("legal.common.related")}: {t(`${base}.related_label`)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
