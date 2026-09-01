"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Mail, Facebook, Download, ArrowUpRight, MapPin, GraduationCap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import homeData from "@/data/home.json";
import { getTechnologyIcon, getTechnologyColor } from "../utils/technology";

const handleSmoothScroll = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const offset = 80;
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

const coreTechnologies = [
  "Next.js 15", "React 19", "TypeScript", "Node.js", "NestJS", 
  ".NET 9.0", "PostgreSQL", "MongoDB", "Docker", "Tailwind CSS", "Redis"
];

const viRoles = [
  "Kỹ sư Full-stack",
  "Kiến trúc sư Hệ thống",
  "Chuyên gia Backend",
  "Kỹ sư Giải pháp Số"
];

const enRoles = [
  "Full-stack Engineer",
  "System Architect",
  "Backend Specialist",
  "Solutions Developer"
];

export default function HomeView() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);

  const isVi = i18n.language === "vi";

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % 4);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#09090b]" />; 
  }

  return (
    <section id="home" className="min-h-screen bg-[#09090b] flex flex-col justify-center pt-28 pb-16 px-4 relative selection:bg-yellow-500/20 selection:text-yellow-400">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10 my-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Bio & Core Info */}
          <motion.div
            className="lg:col-span-7 space-y-7 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{t('home.status', { defaultValue: 'Available for full-time & contract roles' })}</span>
            </div>

            {/* Headline with Dynamic Flipping Role */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2]">
                <span className="text-zinc-300 block">
                  {isVi ? "Kỹ sư Phần mềm &" : "Software Engineer &"}
                </span>
                <div className="h-[1.3em] relative overflow-hidden flex items-center pt-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roleIndex}
                      initial={{ y: 28, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -28, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-yellow-400 block whitespace-nowrap"
                    >
                      {isVi ? viRoles[roleIndex] : enRoles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl font-normal pt-1">
                <Trans 
                  i18nKey="home.description" 
                  values={{ 
                    name: homeData.name, 
                    bio: t('home.bio_desc', { defaultValue: 'Chuyen xay dung he thong backend manh me, kien truc microservices scalable va giao dien web hien dai, toi uu hieu nang.' }) 
                  }}
                >
                  Toi la <span className="text-zinc-200 font-semibold">{homeData.name}</span>. {t('home.bio_desc')}
                </Trans>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={homeData.cvLink}
                download="Ly_Van_My_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold text-sm px-7 py-6 rounded-xl transition-all duration-200 shadow-md shadow-yellow-500/10 cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('home.btn_cv', { defaultValue: 'Download Official CV' })}
                </Button>
              </a>

              <Button
                variant="outline"
                size="lg"
                className="border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 font-medium text-sm px-7 py-6 rounded-xl transition-all duration-200 cursor-pointer"
                onClick={() => handleSmoothScroll("projects")}
              >
                {t('home.btn_projects', { defaultValue: 'Explore Projects' })}
                <ArrowUpRight className="w-4 h-4 ml-2 text-zinc-400" />
              </Button>
            </div>

            {/* Quick Context & Socials */}
            <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t('home.location', { defaultValue: 'Ho Chi Minh City, VN' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t('home.university', { defaultValue: 'FPT University' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href={homeData.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href={homeData.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={homeData.facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href={`mailto:${homeData.email}`} 
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Senior Portrait Card */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative p-2.5 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-2xl backdrop-blur-md max-w-sm w-full">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950">
                <Avatar className="w-full h-full rounded-2xl border border-zinc-800">
                  <AvatarImage 
                    src={homeData.avatar} 
                    alt={homeData.name} 
                    className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 300px, 400px" 
                  />
                  <AvatarFallback className="bg-zinc-900 text-white font-bold text-2xl">MY</AvatarFallback>
                </Avatar>
              </div>

              {/* Clean Footer Strip on Portrait */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{homeData.name}</h4>
                  <p className="text-xs text-zinc-400">Software Engineer</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-yellow-400 font-semibold">{t('home.years_exp', { defaultValue: '2+ Years Exp' })}</span>
                  <p className="text-[11px] text-zinc-500">{t('home.motto', { defaultValue: 'MERN, NestJS & .NET' })}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Core Tech Stack Strip with Interactive Fluid Design */}
        <div className="mt-16 pt-8 border-t border-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              {t('home.core_tech_title', { defaultValue: 'Core Technologies' })}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {coreTechnologies.map((tech) => {
              const Icon = getTechnologyIcon(tech);
              return (
                <div
                  key={tech}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/30 text-zinc-300 hover:text-white text-xs rounded-xl font-mono font-medium transition-all duration-200 shadow-sm group"
                >
                  <Icon className={`w-3.5 h-3.5 ${getTechnologyColor(tech)} transition-transform group-hover:scale-110`} />
                  <span>{tech}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}