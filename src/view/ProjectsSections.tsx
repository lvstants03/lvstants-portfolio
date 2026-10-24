"use client";

import { useState, useEffect, useMemo, startTransition } from "react";
import { 
  Network,
  Table2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGitHubProjects } from "@/hooks/useGitHubProjects";
import ProjectsGraphView from "@/components/ProjectsGraphView";
import ProjectsTableView from "@/components/ProjectsTableView";

export default function ProjectSections() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");

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
    <div className="py-16 md:py-28 relative overflow-hidden bg-[#09090b] text-white">
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

          {/* Controls: Language Filter Pills & View Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
            <div className="flex flex-wrap items-center gap-2">
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
                    onClick={() => startTransition(() => setActiveFilter(filter))}
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

            {/* View Mode Switcher: Graph vs DataTable */}
            <div className="inline-flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 self-start md:self-auto shrink-0 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode("graph")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "graph"
                    ? "bg-yellow-400 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>{t(`${p}.view_graph`, { defaultValue: "Đồ thị mạng" })}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-yellow-400 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>{t(`${p}.view_table`, { defaultValue: "Bảng dữ liệu" })}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Projects Content */}
        <div>
          {githubLoading ? (
            <div className="h-72 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse p-6 space-y-4" />
          ) : filteredGithub.length > 0 ? (
            viewMode === "graph" ? (
              <ProjectsGraphView repos={filteredGithub} />
            ) : (
              <ProjectsTableView repos={filteredGithub} />
            )
          ) : (
            <div className="text-center py-16 text-zinc-500 text-sm">
              {t(`${p}.no_repos`, { defaultValue: "Không tìm thấy kho mã nguồn nào phù hợp với bộ lọc." })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}