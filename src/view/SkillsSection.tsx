"use client";

import { useState, useEffect } from "react";
import { 
  Monitor, 
  Server, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  LucideIcon 
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getTechnologyIcon, getTechnologyColor } from "../utils/technology";

interface SkillPillar {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  expKey: string;
  technologies: string[];
  capabilities: string[];
}

const skillPillars: SkillPillar[] = [
  {
    id: "frontend",
    icon: Monitor,
    titleKey: "Frontend Architecture",
    descKey: "Building high-performance, responsive & accessible web applications",
    expKey: "2+ Years Exp",
    technologies: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Shadcn UI", "HTML5/CSS3"],
    capabilities: [
      "Server-Side Rendering (SSR) & Server Components",
      "Performance optimization (Sub-second LCP, zero layout shifts)",
      "Design systems & WCAG-compliant responsive interfaces"
    ]
  },
  {
    id: "backend",
    icon: Server,
    titleKey: "Backend & Microservices",
    descKey: "Designing robust APIs, distributed systems and modular architectures",
    expKey: "2+ Years Exp",
    technologies: ["Node.js", "Express.js", "NestJS", ".NET 9.0", "Knex.js", "RESTful APIs"],
    capabilities: [
      "Modular controller architectures with 0% regression",
      "Real-time WebSocket event broadcasting & live feeds",
      "Multi-tier tariff & automated billing business logic"
    ]
  },
  {
    id: "database",
    icon: Database,
    titleKey: "Databases & Caching",
    descKey: "Managing structured data, fast queries and real-time caching",
    expKey: "2+ Years Exp",
    technologies: ["PostgreSQL", "SQL Server", "MongoDB", "Redis", "Knex.js"],
    capabilities: [
      "Relational schema design & complex query optimization",
      "Redis Pub/Sub messaging for microservice synchronization",
      "ACID transactions for fintech & seaport operating systems"
    ]
  },
  {
    id: "architecture",
    icon: Cpu,
    titleKey: "Systems & AI Engineering",
    descKey: "Containerization, algorithmic engines and intelligent workflows",
    expKey: "Specialized",
    technologies: ["Docker", "Microservices", "Python/FastAPI", "2D BA Map", "AI Workflows"],
    capabilities: [
      "2D Spatial-Temporal Planning (Berth Allocation Map)",
      "Quantitative trading bots & Big Smart Money (BSA) analysis",
      "AI-assisted development & automated RSS OSINT crawlers"
    ]
  }
];

export default function SkillsSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <section id="skills" className="py-24 bg-[#09090b] min-h-[500px]" />;

  return (
    <section id="skills" className="py-24 bg-[#09090b] text-zinc-100 relative">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14">
          <span className="text-xs text-yellow-400 font-mono font-semibold uppercase tracking-widest block mb-2">
            02 / {t("skills.badge", { defaultValue: "TECHNICAL EXPERTISE" })}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t("skills.title", { defaultValue: "Skills" })} & {t("skills.subtitle", { defaultValue: "Tech Matrix" })}
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            {t("skills.description", { defaultValue: "Tập hợp các năng lực kỹ thuật cốt lõi, kiến trúc hệ thống phân tán và quy trình kỹ thuật chuẩn mực." })}
          </p>
        </div>

        {/* 4-Pillar Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillPillars.map((pillar, idx) => {
            const Icon = pillar.icon;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-sm group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-zinc-950 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {pillar.titleKey}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {pillar.descKey}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-zinc-950 text-yellow-400 border border-zinc-800 rounded-md shrink-0">
                      {pillar.expKey}
                    </span>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {pillar.technologies.map((tech) => {
                      const TechIcon = getTechnologyIcon(tech);
                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg"
                        >
                          <TechIcon className={`w-3 h-3 ${getTechnologyColor(tech)}`} />
                          <span>{tech}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Capabilities Bullet List */}
                  <div className="space-y-2.5 pt-4 border-t border-zinc-800/80">
                    {pillar.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed font-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="mt-6 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Pillar 0{idx + 1}</span>
                  <Layers className="w-3.5 h-3.5 text-zinc-600 group-hover:text-yellow-400 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}