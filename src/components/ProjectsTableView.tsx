"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Code2, 
  Clock, 
  ArrowUpDown,
  FolderGit2,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { GitHubRepo } from "@/app/api/github/route";

interface ProjectsTableViewProps {
  repos: GitHubRepo[];
}

type SortField = "name" | "stars" | "updatedAt";
type SortOrder = "asc" | "desc";

export default function ProjectsTableView({ repos }: ProjectsTableViewProps) {
  const { t, i18n } = useTranslation();
  const p = "projects.projects";

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("stars");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Xu ly loc va tim kiem du an
  const filteredAndSortedRepos = useMemo(() => {
    let result = (repos || []).filter((repo) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchName = repo.name?.toLowerCase().includes(term);
      const matchDesc = repo.description?.toLowerCase().includes(term);
      const matchLang = repo.language?.toLowerCase().includes(term);
      const matchTopic = repo.topics?.some((topic) => topic.toLowerCase().includes(term));
      return matchName || matchDesc || matchLang || matchTopic;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "stars") {
        comparison = (a.stars || 0) - (b.stars || 0);
      } else if (sortField === "updatedAt") {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [repos, searchTerm, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Mau sac badge theo ngon ngu lap trinh
  const getLanguageBadgeClass = (lang?: string) => {
    switch (lang?.toLowerCase()) {
      case "typescript":
        return "border-blue-500/30 text-blue-400 bg-blue-500/10";
      case "javascript":
        return "border-yellow-500/30 text-yellow-400 bg-yellow-500/10";
      case "python":
        return "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";
      case "c++":
      case "c#":
        return "border-purple-500/30 text-purple-400 bg-purple-500/10";
      case "go":
        return "border-cyan-500/30 text-cyan-400 bg-cyan-500/10";
      case "rust":
        return "border-orange-500/30 text-orange-400 bg-orange-500/10";
      case "html":
      case "css":
        return "border-rose-500/30 text-rose-400 bg-rose-500/10";
      default:
        return "border-zinc-800 text-zinc-300 bg-zinc-900";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search and Table Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80 backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t(`${p}.table_search_placeholder`, { defaultValue: "Tìm kiếm dự án, công nghệ, mô tả..." })}
            className="w-full pl-10 pr-9 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400/80 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Count Indicator */}
        <div className="text-xs text-zinc-400 font-medium px-2 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-yellow-400/80" />
          <span>
            {t(`${p}.showing_results`, { count: filteredAndSortedRepos.length, defaultValue: `Hiển thị ${filteredAndSortedRepos.length} dự án` })}
          </span>
        </div>
      </div>

      {/* Enterprise DataTable Container */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead className="sticky top-0 z-10 backdrop-blur-md bg-zinc-900/95 shadow-sm">
              <tr className="border-b border-zinc-800/80 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 px-4 w-[28%]">
                  <button 
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{t(`${p}.col_project`, { defaultValue: "Dự án" })}</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </th>
                <th className="py-3.5 px-3 w-[14%]">
                  <span>{t(`${p}.col_language`, { defaultValue: "Ngôn ngữ" })}</span>
                </th>
                <th className="py-3.5 px-4 w-[30%]">
                  <span>{t(`${p}.col_description`, { defaultValue: "Mô tả" })}</span>
                </th>
                <th className="py-3.5 px-3 w-[12%]">
                  <button 
                    onClick={() => toggleSort("stars")}
                    className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{t(`${p}.col_stats`, { defaultValue: "Chỉ số" })}</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </th>
                <th className="py-3.5 px-3 w-[12%]">
                  <button 
                    onClick={() => toggleSort("updatedAt")}
                    className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{t(`${p}.col_updated`, { defaultValue: "Cập nhật" })}</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </th>
                <th className="py-3.5 px-4 w-[14%] text-right">
                  <span>{t(`${p}.col_actions`, { defaultValue: "Thao tác" })}</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-850 text-xs">
              {filteredAndSortedRepos.length > 0 ? (
                filteredAndSortedRepos.map((repo, idx) => (
                  <motion.tr
                    key={repo.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.3) }}
                    className="hover:bg-zinc-900/60 transition-colors group"
                  >
                    {/* Project Name & Link */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-yellow-400 shrink-0 mt-0.5 group-hover:border-yellow-400/40 transition-colors">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white group-hover:text-yellow-400 transition-colors block truncate tracking-tight text-[13px]"
                            title={repo.name}
                          >
                            {repo.name}
                          </a>
                          {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              {repo.topics.slice(0, 2).map((topic, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800/80 text-zinc-400"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Language Badge */}
                    <td className="py-3.5 px-3">
                      {repo.language ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${getLanguageBadgeClass(repo.language)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{repo.language}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4">
                      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed" title={repo.description || ""}>
                        {repo.description?.trim() 
                          ? repo.description 
                          : (i18n.language === "vi" 
                              ? "Dự án mã nguồn mở phát triển bởi lvstants03." 
                              : "Open-source project developed by lvstants03.")}
                      </p>
                    </td>

                    {/* Metrics: Stars & Forks */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5 text-zinc-400 text-xs">
                        <span className="flex items-center gap-1 text-yellow-400/90 font-medium">
                          <Star className="w-3.5 h-3.5 fill-yellow-400/30 text-yellow-400" />
                          <span>{repo.stars || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <GitFork className="w-3.5 h-3.5" />
                          <span>{repo.forks || 0}</span>
                        </span>
                      </div>
                    </td>

                    {/* Updated At */}
                    <td className="py-3.5 px-3 text-zinc-400">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>
                          {new Date(repo.updatedAt).toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US")}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {repo.homepage && repo.homepage.startsWith("http") && (
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-zinc-950 transition-all border border-yellow-400/20"
                            title={t(`${p}.live_demo`, { defaultValue: "Xem Demo" })}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-800"
                          title={t(`${p}.view_repo`, { defaultValue: "Mã nguồn" })}
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 text-xs">
                    {t(`${p}.no_repos`, { defaultValue: "Không tìm thấy kho mã nguồn nào phù hợp với bộ lọc." })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
