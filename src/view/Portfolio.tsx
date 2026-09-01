"use client";

import HomeView from "./HomeSection";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import Header from "./Header";
import CertificatesSection from "./CertificationSection";
import ProjectSections from "./ProjectsSections";
import ExperienceSection from "./ExperienceSection";
import SpotlightEffect from "@/components/SpotlightEffect";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { VerticalNav } from "@/components/VerticalNav";

const sectionIds = ["home", "introduce", "skills", "projects", "certificates", "experience"];

export default function Portfolio() {
  const activeSection = useScrollSpy(sectionIds);

  return (
    <div className="Body-content bg-[#09090b] text-zinc-100 min-h-screen relative selection:bg-yellow-500/20 selection:text-yellow-400">
      
      {/* Top Subtle Scroll Indicator */}
      <ScrollProgressBar />

      {/* Ambient Grid & Subtle Spotlight */}
      <SpotlightEffect />

      {/* Header */}
      <Header activeSection={activeSection ?? "home"} />

      {/* Vertical Navigation Indicator */}
      <VerticalNav activeSection={activeSection ?? undefined} sectionIds={sectionIds} />

      <main className="relative z-10">
        <section id="home">
          <HomeView />
        </section>

        <section id="introduce" className="border-t border-zinc-900">
          <AboutSection />
        </section>

        <section id="skills" className="border-t border-zinc-900">
          <SkillsSection />
        </section>

        <section id="projects" className="border-t border-zinc-900">
          <ProjectSections />
        </section>

        <section id="certificates" className="border-t border-zinc-900">
          <CertificatesSection />
        </section>

        <section id="experience" className="border-t border-zinc-900 pb-28">
          <ExperienceSection />
        </section>
      </main>
    </div>
  );
}