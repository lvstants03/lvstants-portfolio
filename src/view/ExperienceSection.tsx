"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Code2, 
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import experienceData from "@/data/experience.json";

export default function ExperienceSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const experiences = experienceData.workExperience;
  const [selectedId, setSelectedId] = useState(experiences[0]?.id || "");
  const expPrefix = "experience";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <section className="py-24 bg-[#09090b] min-h-[500px]" />;

  const currentExp = experiences.find(e => e.id === selectedId) || experiences[0];

  return (
    <section id="experience" className="py-24 bg-[#09090b] text-zinc-100 relative">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs text-yellow-400 font-mono font-semibold uppercase tracking-widest block mb-2">
            04 / {t(`${expPrefix}.badge`, { defaultValue: "CAREER TIMELINE" })}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t(`${expPrefix}.title`, { defaultValue: "Work" })} {t(`${expPrefix}.subtitle`, { defaultValue: "Experience" })}
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            {t(`${expPrefix}.description`, { defaultValue: "Kinh nghiệm tích lũy qua các dự án doanh nghiệp thực tế và giải pháp phần mềm quy mô lớn." })}
          </p>
        </div>

        {/* Master-Detail Tabbed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Role & Company Selector Tabs (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider px-1 mb-1">
              {t(`${expPrefix}.select_position`, { defaultValue: "Select Position" })}
            </span>

            {experiences.map((exp, idx) => {
              const isSelected = exp.id === currentExp.id;
              const roleName = t(`${expPrefix}.items.${exp.id}.role`, { defaultValue: exp.role });
              const companyShort = t(`${expPrefix}.items.${exp.id}.company_short`, { defaultValue: exp.company });
              const periodText = t(`${expPrefix}.items.${exp.id}.period`, { defaultValue: exp.period });

              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedId(exp.id)}
                  className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 border-yellow-500/50 shadow-lg shadow-yellow-500/5"
                      : "bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                      isSelected
                        ? "bg-yellow-400 text-zinc-950 border-yellow-400"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 group-hover:text-yellow-400"
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-zinc-500">0{idx + 1}</span>
                        <span className={`text-[11px] font-mono font-semibold truncate ${
                          isSelected ? "text-yellow-400" : "text-zinc-400"
                        }`}>
                          {periodText}
                        </span>
                      </div>

                      <h4 className={`text-xs sm:text-sm font-bold leading-tight truncate ${
                        isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
                      }`}>
                        {roleName}
                      </h4>

                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {companyShort}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? "text-yellow-400 translate-x-0.5" : "text-zinc-600 opacity-0 group-hover:opacity-100"
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Position Showcase (Col 8) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800 shadow-xl space-y-6 backdrop-blur-sm"
              >
                {/* Header Strip */}
                <div className="space-y-3 pb-5 border-b border-zinc-800/80">
                  {/* Top Row: Role + Period + Company Website Button */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-500/20 rounded-md text-[11px] font-mono font-bold uppercase">
                        {t(`${expPrefix}.items.${currentExp.id}.role`, { defaultValue: currentExp.role })}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {t(`${expPrefix}.items.${currentExp.id}.period`, { defaultValue: currentExp.period })}
                      </span>
                    </div>

                    {currentExp.website && (
                      <a
                        href={currentExp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl transition-colors shrink-0 cursor-pointer"
                      >
                        <span>{t(`${expPrefix}.company_website`, { defaultValue: "Company Website" })}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                      </a>
                    )}
                  </div>

                  {/* Company Name & Location */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                      {t(`${expPrefix}.items.${currentExp.id}.company`, { defaultValue: currentExp.company })}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t(`${expPrefix}.items.${currentExp.id}.location`, { defaultValue: currentExp.location })}</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed border-l-2 border-yellow-400/40 pl-3.5 py-0.5 font-normal">
                  {t(`${expPrefix}.items.${currentExp.id}.summary`, { defaultValue: currentExp.summary })}
                </p>

                {/* Projects Detail Block */}
                <div className="space-y-5">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block">
                    {t(`${expPrefix}.deliverables`, { defaultValue: "Key Projects & Deliverables" })}
                  </span>

                  {currentExp.projects.map((proj, pIdx) => {
                    const translatedProjName = t(`${expPrefix}.items.${currentExp.id}.projects.${pIdx}.name`, { defaultValue: proj.name });
                    const translatedResList = t(`${expPrefix}.items.${currentExp.id}.projects.${pIdx}.responsibilities`, { returnObjects: true });
                    const resItems = Array.isArray(translatedResList) ? translatedResList : proj.responsibilities;

                    return (
                      <div key={pIdx} className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-yellow-400 shrink-0" />
                            <span>{translatedProjName}</span>
                          </h4>

                          <div className="flex flex-wrap gap-1.5">
                            {proj.techStack.map((tech) => (
                              <span key={tech} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <ul className="space-y-2 pt-2 border-t border-zinc-900">
                          {resItems.map((res: string, rIdx: number) => (
                            <li key={rIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed font-normal">
                              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                              <span>{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Key Takeaways */}
                {(() => {
                  const translatedTakeaways = t(`${expPrefix}.items.${currentExp.id}.takeaways`, { returnObjects: true });
                  const takeawayItems = Array.isArray(translatedTakeaways) ? translatedTakeaways : (currentExp.keyTakeaways || []);

                  return takeawayItems.length > 0 ? (
                    <div className="pt-4 border-t border-zinc-800/80">
                      <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2.5">
                        {t(`${expPrefix}.takeaways_label`, { defaultValue: "Skills & Key Takeaways" })}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {takeawayItems.map((item: string, tIdx: number) => (
                          <span key={tIdx} className="px-2.5 py-1 bg-zinc-950 text-zinc-300 text-xs font-mono rounded-lg border border-zinc-800">
                            # {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}