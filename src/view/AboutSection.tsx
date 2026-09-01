"use client";

import { useState, useEffect } from "react";
import { 
  GraduationCap, Monitor, Server, Palette, 
  CheckCircle2, Layers, Cpu,
  LucideIcon 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import aboutData from "@/data/about.json";

const IconMap: Record<string, LucideIcon> = {
  Monitor: Monitor,
  Server: Server,
  Palette: Palette
};

export default function AboutSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <section id="introduce" className="py-24 bg-[#09090b]" />;
  }

  return (
    <section id="introduce" className="py-24 px-4 bg-[#09090b] text-zinc-100 relative">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14">
          <span className="text-xs text-yellow-400 font-mono font-semibold uppercase tracking-widest block mb-2">
            01 / {t('about.education.title', { defaultValue: 'EDUCATION & BACKGROUND' })}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t('about.focus_title', { defaultValue: 'Background & Engineering Focus' })}
          </h2>
        </div>

        {/* Clean Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Bento 1: Engineering Focus & Principles (Col 7) */}
          <div className="md:col-span-7 p-7 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
                <Cpu className="w-4 h-4 text-yellow-400" />
                <span>{t('about.philosophy_badge', { defaultValue: 'Philosophy & Approach' })}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {t('about.philosophy_title', { defaultValue: 'Building reliable software with scalable architectures' })}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
                {t('about.philosophy_desc', { defaultValue: 'Tôi tập trung vào việc phát triển các giải pháp phần mềm toàn diện từ backend đến frontend, chú trọng tính mở rộng (scalability), hiệu năng cao và trải nghiệm người dùng tinh tế.' })}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80 text-xs">
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{t('about.clean_code', { defaultValue: 'Clean Code & Architecture' })}</span>
                    <span className="text-zinc-500 text-[11px]">{t('about.clean_code_desc', { defaultValue: 'Maintainable, Modular, Testable' })}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{t('about.perf_ui', { defaultValue: 'Performance-First UI' })}</span>
                    <span className="text-zinc-500 text-[11px]">{t('about.perf_ui_desc', { defaultValue: 'Fast LCP, Zero Layout Shifts' })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>MERN Stack, NestJS, .NET 9.0</span>
              <span>RESTful & Microservices</span>
            </div>
          </div>

          {/* Bento 2: Education (Col 5) */}
          <div className="md:col-span-5 p-7 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
                <GraduationCap className="w-4 h-4 text-yellow-400" />
                <span>{t('about.formal_edu', { defaultValue: 'Formal Education' })}</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-white p-1 border border-zinc-700">
                  <Image
                    src={aboutData.education.logo}
                    alt="University Logo"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-snug">{t('about.education.degree', { defaultValue: 'Bachelor - Software Engineering (Graduated)' })}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t('about.education.university', { defaultValue: 'FPT University' })}</p>
                  <p className="text-yellow-400 text-[11px] font-mono mt-1">{t('about.education.duration', { defaultValue: '2021 - 2025 (Graduated)' })}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">{t('about.major', { defaultValue: 'Major' })}</span>
                <span className="text-zinc-200 font-medium">{t('about.major_val', { defaultValue: 'Software Engineering' })}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">{t('about.career_vision', { defaultValue: 'Career Vision' })}</span>
                <span className="text-yellow-400 font-mono font-semibold">{t('about.career_vision_val', { defaultValue: 'Software Architect (Enterprise & Microservices)' })}</span>
              </div>
            </div>
          </div>

          {/* Bento 3: 3 Pillars of Expertise (Col 12) */}
          <div className="md:col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {aboutData.expertiseCategories.map((item, index) => {
                const Icon = IconMap[item.icon] || Monitor;
                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-yellow-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 bg-zinc-800 text-zinc-300 rounded-md font-mono">
                          {t(`about.expertiseCategories.${item.id as 'frontend' | 'backend' | 'uiux'}.experience`)}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-2">
                        {t(`about.expertiseCategories.${item.id as 'frontend' | 'backend' | 'uiux'}.title`)}
                      </h4>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        {t(`about.expertiseCategories.${item.id as 'frontend' | 'backend' | 'uiux'}.desc`)}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>Area 0{index + 1}</span>
                      <Layers className="w-3.5 h-3.5 text-zinc-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}