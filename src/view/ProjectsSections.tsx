"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Code2, 
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useGitHubProjects } from "@/hooks/useGitHubProjects";
import { GitHubRepo } from "@/app/api/github/route";

export default function ProjectSections() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const { repos, loading: githubLoading } = useGitHubProjects();
  const p = "projects.projects";

  useEffect(() => {
    setMounted(true);

    const handleVoiceFilter = (e: Event) => {
      const ce = e as CustomEvent<{ target?: string }>;
      if (ce.detail?.target) {
        if (ce.detail.target.toLowerCase() === "all") {
          setActiveFilter("ALL");
        } else {
          setActiveFilter(ce.detail.target);
        }
      }
    };
    window.addEventListener("portfolio:filter-projects", handleVoiceFilter);
    return () => window.removeEventListener("portfolio:filter-projects", handleVoiceFilter);
  }, []);

  // Compute available languages for filtering
  const githubLanguages = useMemo(() => {
    const langs = Array.from(new Set(repos.map(r => r.language).filter(Boolean)));
    return ["ALL", ...langs];
  }, [repos]);

  // Filtered repositories based on selected language
  const filteredGithub = useMemo(() => {
    if (activeFilter === "ALL") return repos;
    return repos.filter(item => item.language?.toLowerCase() === activeFilter.toLowerCase());
  }, [repos, activeFilter]);

  if (!mounted) {
    return <section id="projects" className="py-24 bg-[#09090b] min-h-[600px]" />;
  }

  return (
    <section id="projects" className="py-28 relative overflow-hidden bg-[#09090b] text-white">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs text-yellow-400 font-mono font-semibold uppercase tracking-widest block mb-2">
            03 / {t(`${p}.badge`, { defaultValue: "FEATURED PROJECTS" })}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t(`${p}.title`, { defaultValue: "Featured" })} {t(`${p}.subtitle`, { defaultValue: "Projects" })}
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            {t(`${p}.description`, { defaultValue: "Toàn bộ mã nguồn mở và hệ thống phần mềm được đồng bộ hóa trực tiếp thời gian thực từ GitHub." })}
          </p>

          {/* Language Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-8">
            {githubLanguages.map((filter) => {
              const count = filter !== "ALL"
                ? repos.filter(r => r.language?.toLowerCase() === filter.toLowerCase()).length
                : repos.length;

              const label = filter === "ALL" 
                ? t(`${p}.all_filter`, { defaultValue: "All" })
                : filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    activeFilter.toUpperCase() === filter.toUpperCase()
                      ? "bg-yellow-400 text-zinc-950 shadow-md font-bold"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    activeFilter.toUpperCase() === filter.toUpperCase()
                      ? "bg-black/20 text-black font-bold"
                      : "bg-black/50 text-zinc-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Projects Grid */}
        <div>
          {githubLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse p-6 space-y-4">
                  <div className="h-5 bg-white/10 rounded-md w-3/4" />
                  <div className="h-4 bg-white/5 rounded-md w-full" />
                  <div className="h-4 bg-white/5 rounded-md w-2/3" />
                  <div className="h-8 bg-white/5 rounded-xl w-full mt-auto" />
                </div>
              ))}
            </div>
          ) : filteredGithub.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGithub.map((repo: GitHubRepo) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col justify-between bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-all duration-300 group overflow-hidden rounded-2xl shadow-sm p-6">
                    <div>
                      {/* Header: Title & Stars / Forks */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-yellow-400 shrink-0" />
                          <a 
                            href={repo.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1 tracking-tight"
                          >
                            {repo.name}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="flex items-center gap-1 text-[11px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {repo.stars}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            <GitFork className="w-3 h-3" />
                            {repo.forks}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-zinc-400 text-xs line-clamp-3 mb-5 leading-relaxed min-h-[48px] font-normal">
                        {repo.description}
                      </p>

                      {/* Language & Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-6">
                        {repo.language && (
                          <span className="px-2.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold rounded-md uppercase font-mono">
                            {repo.language}
                          </span>
                        )}
                        {repo.topics?.slice(0, 3).map((topic, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 bg-zinc-950 text-zinc-400 border border-zinc-800 text-[10px] font-mono rounded-md">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3.5 border-t border-zinc-800/80 mt-auto">
                      <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-yellow-400/80" />
                          <span>{new Date(repo.updatedAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono uppercase">GitHub</span>
                      </div>

                      <div className={`grid ${repo.homepage ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
                        {repo.homepage && (
                          <Button
                            size="sm"
                            onClick={() => window.open(repo.homepage, "_blank")}
                            className="h-8 w-full bg-yellow-400 text-zinc-950 hover:bg-yellow-300 font-bold text-[11px] uppercase rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{t(`${p}.live_demo`, { defaultValue: "Live Demo" })}</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(repo.url, "_blank")}
                          className="h-8 w-full border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white font-medium text-[11px] uppercase rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>{t(`${p}.view_repo`, { defaultValue: "View Repo" })}</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-500 text-sm">
              {t(`${p}.no_repos`, { defaultValue: "Khong tim thay repositories phu hop voi bo loc." })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}