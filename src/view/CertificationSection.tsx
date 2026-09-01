"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Award, Calendar, CheckCircle2, ArrowUpRight, ShieldCheck } from "lucide-react";
import certData from "@/data/certificates.json"; 
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface Certificate {
  id: string | number;
  name: string;
  organization: string;
  image?: string;
  url?: string;
  category: string;
  description?: string;
  issueDate: {
    month: string | number;
    year: string | number;
  };
}

export default function CertificatesSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  const allCertificates = certData.certificates as Certificate[];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <section id="certificates" className="py-24 bg-[#09090b] min-h-[500px]" />;

  return (
    <section id="certificates" className="py-24 bg-[#09090b] px-4 relative text-zinc-100">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14">
          <span className="text-xs text-yellow-400 font-mono font-semibold uppercase tracking-widest block mb-2">
            05 / {t("certificates.badge", { defaultValue: "ACCREDITATIONS & CREDENTIALS" })}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t("certificates.title", { defaultValue: "Certificates" })} & {t("certificates.subtitle", { defaultValue: "Recognitions" })}
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            {t("certificates.description", { defaultValue: "Chứng chỉ quốc tế từ các tổ chức và trường đại học hàng đầu về kỹ thuật phần mềm, UI/UX và quản lý dự án." })}
          </p>
        </div>

        {/* Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCertificates.map((cert: Certificate, index: number) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="h-full"
            >
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between h-full shadow-sm group">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-yellow-400/10 text-yellow-400 border border-yellow-500/20 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
                      {cert.organization}
                    </span>

                    <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex items-start gap-2.5 mb-3">
                    <Award className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-yellow-400 transition-colors">
                      {cert.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-normal min-h-[36px]">
                    {t(`certificates.items.${cert.id}`, { defaultValue: cert.description || "Chứng chỉ chuyên môn quốc tế." })}
                  </p>
                </div>

                {/* Footer Strip */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{cert.issueDate.month}/{cert.issueDate.year}</span>
                  </div>

                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold px-3 py-1.5 bg-zinc-950 hover:bg-yellow-400 text-zinc-300 hover:text-zinc-950 border border-zinc-800 hover:border-yellow-400 rounded-lg transition-all"
                    >
                      <span>{t("certificates.verify_btn", { defaultValue: "Verify" })}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-zinc-500 font-mono italic">
                      {t("certificates.updating", { defaultValue: "Documented" })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}