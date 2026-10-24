"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitFork, 
  Star, 
  ExternalLink, 
  Github, 
  Code2, 
  X,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { GitHubRepo } from "@/app/api/github/route";

interface ProjectsGraphViewProps {
  repos: GitHubRepo[];
}

interface NodePosition {
  id: string;
  name: string;
  type: "root" | "category" | "project";
  x: number;
  y: number;
  category?: string;
  repo?: GitHubRepo;
}

interface Edge {
  id: string;
  from: NodePosition;
  to: NodePosition;
  active: boolean;
}

export default function ProjectsGraphView({ repos }: ProjectsGraphViewProps) {
  const { t, i18n } = useTranslation();
  const p = "projects.projects";

  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom va Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Validation: loc bo repos khong hop le va chuan hoa
  const validRepos = useMemo(() => {
    return (repos || []).map((repo) => ({
      ...repo,
      description: repo.description?.trim() 
        ? repo.description 
        : (i18n.language === "vi" 
            ? "Dự án mã nguồn mở phát triển bởi lvstants03." 
            : "Open-source project developed by lvstants03."),
      language: repo.language || "Other",
      homepage: repo.homepage && repo.homepage.startsWith("http") ? repo.homepage : undefined,
    }));
  }, [repos, i18n.language]);

  // Nhom repos theo category/language va tinh toa do
  const { nodes, edges } = useMemo(() => {
    const width = 1100;
    const height = 680;
    const centerX = width / 2;
    const centerY = height / 2;

    const computedNodes: NodePosition[] = [];
    const computedEdges: Edge[] = [];

    // 1. Root Node o tam toa do
    const rootNode: NodePosition = {
      id: "root",
      name: i18n.language === "vi" ? "HỆ THỐNG" : "ECOSYSTEM",
      type: "root",
      x: centerX,
      y: centerY,
    };
    computedNodes.push(rootNode);

    // 2. Lay danh sach Categories (Ngon ngu)
    const categoryMap: { [cat: string]: GitHubRepo[] } = {};
    validRepos.forEach((repo) => {
      const cat = repo.language;
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(repo);
    });

    const categories = Object.keys(categoryMap);
    const categoryRadius = 180;

    // 3. Tinh toa do cho tung Category Node
    categories.forEach((cat, catIdx) => {
      const catAngle = (catIdx / categories.length) * 2 * Math.PI - Math.PI / 2;
      const catX = centerX + categoryRadius * Math.cos(catAngle);
      const catY = centerY + categoryRadius * Math.sin(catAngle);

      const catNode: NodePosition = {
        id: `cat-${cat}`,
        name: cat,
        type: "category",
        x: catX,
        y: catY,
        category: cat,
      };
      computedNodes.push(catNode);

      // Edge: Root -> Category
      computedEdges.push({
        id: `edge-root-${cat}`,
        from: rootNode,
        to: catNode,
        active: false,
      });

      // 4. Tinh toa do cac Project Nodes toa ra tu Category (so le khoang cach de khong chong len nhau)
      const childRepos = categoryMap[cat];
      const maxSpread = Math.min(1.8, 0.42 * childRepos.length);

      childRepos.forEach((repo, childIdx) => {
        const offset = childRepos.length === 1 
          ? 0 
          : (childIdx - (childRepos.length - 1) / 2) * (maxSpread / (childRepos.length - 1));
        const projectAngle = catAngle + offset;
        
        // So le ban kinh 310px va 370px giup cac nhan khong bi va cham
        const leafRadius = childIdx % 2 === 0 ? 310 : 370;
        const projX = centerX + leafRadius * Math.cos(projectAngle);
        const projY = centerY + leafRadius * Math.sin(projectAngle);

        const projNode: NodePosition = {
          id: `proj-${repo.id}`,
          name: repo.name,
          type: "project",
          category: cat,
          repo,
          x: projX,
          y: projY,
        };
        computedNodes.push(projNode);

        // Edge: Category -> Project
        computedEdges.push({
          id: `edge-${cat}-${repo.id}`,
          from: catNode,
          to: projNode,
          active: selectedRepo?.id === repo.id,
        });
      });
    });

    return { nodes: computedNodes, edges: computedEdges };
  }, [validRepos, selectedRepo, i18n.language]);

  // Tu dong chon repo dau tien neu chua chon de nguoi dung thay Tooltip
  useEffect(() => {
    if (!selectedRepo && validRepos.length > 0) {
      setSelectedRepo(validRepos[0]);
    }
  }, [validRepos, selectedRepo]);

  // Toast thong bao khi cuon chuot ma chua an Ctrl
  const [showCtrlHint, setShowCtrlHint] = useState(false);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Xu ly Zoom va Pan bang ban phim hoac Ctrl + con chuot
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const zoomStep = delta > 0 ? 0.08 : -0.08;
        setZoom((prevZoom) => {
          const next = Number((prevZoom + zoomStep).toFixed(2));
          return Math.min(2.5, Math.max(0.4, next));
        });
      } else {
        // Hien thi goi y giu Ctrl trong 1.6 giay
        setShowCtrlHint(true);
        if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = setTimeout(() => {
          setShowCtrlHint(false);
        }, 1600);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  // Xu ly Zoom bang nut bam
  const handleZoomIn = () => setZoom(z => Math.min(2.5, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, Number((z - 0.15).toFixed(2))));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Xu ly Pan (Keo tha canvas)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Khong pan neu click vao nut hoac node
    if ((e.target as HTMLElement).tagName === "circle" || (e.target as HTMLElement).tagName === "button") return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      className="relative w-full rounded-3xl bg-zinc-950/85 border border-zinc-800/80 focus:border-yellow-500/40 focus:outline-none transition-colors overflow-hidden shadow-2xl backdrop-blur-xl select-none"
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#eab308 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      {/* Guide Banner */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 backdrop-blur-md shadow-md">
        <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
        <span>{t(`${p}.graph_hint`, { defaultValue: "Nhấp vào bất kỳ Node dự án nào để xem chi tiết" })}</span>
      </div>

      {/* Toast Huong dan giu Ctrl + Cuon chuot */}
      <AnimatePresence>
        {showCtrlHint && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-xl bg-zinc-900/95 border border-yellow-500/50 text-yellow-300 text-xs font-medium shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-2"
          >
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-white">Ctrl</span>
            <span>+</span>
            <span>{i18n.language === "vi" ? "Cuộn chuột để phóng to / thu nhỏ" : "Scroll to zoom in / out"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom and Pan Controls Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md backdrop-blur-md">
        <span className="hidden sm:inline-block text-[10px] text-zinc-500 font-mono px-2">
          Ctrl + Scroll
        </span>
        <div className="hidden sm:block w-[1px] h-3.5 bg-zinc-800" />
        <button
          onClick={handleZoomIn}
          title={t(`${p}.zoom_in`, { defaultValue: "Phóng to" })}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-zinc-400 px-1 font-semibold min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          title={t(`${p}.zoom_out`, { defaultValue: "Thu nhỏ" })}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-3.5 bg-zinc-800 mx-0.5" />
        <button
          onClick={handleResetZoom}
          title={t(`${p}.reset_zoom`, { defaultValue: "Đặt lại" })}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive SVG Network */}
      <div 
        className={`w-full overflow-hidden py-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          viewBox="0 0 1100 680" 
          className="w-full min-w-[700px] h-[580px] md:h-[620px]"
        >
          <defs>
            {/* Glowing Gradient Filters */}
            <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="activeEdge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Scalable & Pannable Group */}
          <g 
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ 
              transformOrigin: "550px 340px",
              transition: isDragging ? "none" : "transform 0.15s ease-out" 
            }}
          >
            {/* 1. Render Edges (Connecting Bezier Curves) */}
            <g className="edges-layer">
              {edges.map((edge) => {
                const isSelected = selectedRepo && edge.to.repo?.id === selectedRepo.id;
                const isHovered = hoveredNodeId === edge.to.id;
                const dx = edge.to.x - edge.from.x;
                const dy = edge.to.y - edge.from.y;
                const cx1 = edge.from.x + dx * 0.45;
                const cy1 = edge.from.y + dy * 0.05;
                const cx2 = edge.from.x + dx * 0.55;
                const cy2 = edge.to.y - dy * 0.05;

                const pathD = `M ${edge.from.x} ${edge.from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${edge.to.x} ${edge.to.y}`;

                return (
                  <g key={edge.id}>
                    {/* Outer glow stroke for active edge */}
                    {(isSelected || isHovered) && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#eab308"
                        strokeWidth={3}
                        strokeOpacity={0.6}
                        filter="url(#glow)"
                      />
                    )}
                    {/* Core Stroke */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isSelected ? "url(#activeEdge)" : isHovered ? "#facc15" : "#3f3f46"}
                      strokeWidth={isSelected ? 2.5 : 1}
                      strokeOpacity={isSelected ? 1 : isHovered ? 0.8 : 0.35}
                      strokeDasharray={isSelected ? "none" : "3 3"}
                      className="transition-colors duration-300"
                    />
                  </g>
                );
              })}
            </g>

            {/* 2. Render Nodes */}
            <g className="nodes-layer">
              {nodes.map((node) => {
                const isRoot = node.type === "root";
                const isCategory = node.type === "category";
                const isProject = node.type === "project";
                const isSelected = isProject && selectedRepo?.id === node.repo?.id;
                const isHovered = hoveredNodeId === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className={isProject ? "cursor-pointer" : "cursor-default"}
                    onClick={() => {
                      if (isProject && node.repo) {
                        setSelectedRepo(node.repo);
                      }
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Root Node */}
                    {isRoot && (
                      <g filter="url(#glow)">
                        <circle r={28} fill="#09090b" stroke="#eab308" strokeWidth={2.5} />
                        <circle r={20} fill="#eab308" fillOpacity={0.15} />
                        <text
                          textAnchor="middle"
                          dy="4"
                          fill="#facc15"
                          fontSize="9.5"
                          fontWeight="bold"
                          letterSpacing="0.8"
                        >
                          {node.name}
                        </text>
                      </g>
                    )}

                    {/* Category Node */}
                    {isCategory && (
                      <g>
                        <circle 
                          r={18} 
                          fill="#18181b" 
                          stroke="#71717a" 
                          strokeWidth={1.5} 
                          className="transition-colors duration-200"
                        />
                        <circle r={7} fill="#eab308" fillOpacity={0.6} />
                        
                        {/* Background Pill for Category Label */}
                        <rect
                          x={-((node.name.length * 7.5 + 16) / 2)}
                          y={20}
                          width={node.name.length * 7.5 + 16}
                          height={18}
                          rx={9}
                          fill="#09090b"
                          fillOpacity={0.85}
                          stroke="#27272a"
                          strokeWidth={1}
                        />
                        <text
                          textAnchor="middle"
                          dy={32}
                          fill="#d4d4d8"
                          fontSize="10"
                          fontWeight="600"
                          letterSpacing="0.3"
                        >
                          {node.name}
                        </text>
                      </g>
                    )}

                    {/* Project Leaf Node */}
                    {isProject && (
                      <g 
                        className="transition-transform duration-200" 
                        style={{ transform: isSelected || isHovered ? "scale(1.2)" : "scale(1)" }}
                      >
                        {/* Selection animated rotating ring */}
                        {isSelected && (
                          <circle
                            r={20}
                            fill="none"
                            stroke="#eab308"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                            className="animate-spin origin-center"
                            style={{ transformOrigin: "0 0" }}
                          />
                        )}
                        
                        <circle
                          r={13}
                          fill={isSelected ? "#eab308" : isHovered ? "#27272a" : "#18181b"}
                          stroke={isSelected ? "#fef08a" : isHovered ? "#eab308" : "#3f3f46"}
                          strokeWidth={isSelected ? 2 : 1.5}
                          filter={isSelected ? "url(#glow)" : undefined}
                        />
                        <circle 
                          r={4.5} 
                          fill={isSelected ? "#09090b" : "#eab308"} 
                        />

                        {/* Label Text Pill below node */}
                        {(() => {
                          const displayName = node.name.length > 18 
                            ? `${node.name.substring(0, 16)}...` 
                            : node.name;
                          const pillWidth = Math.max(50, displayName.length * 6.5 + 14);

                          return (
                            <g>
                              <rect
                                x={-(pillWidth / 2)}
                                y={18}
                                width={pillWidth}
                                height={17}
                                rx={8.5}
                                fill={isSelected ? "#854d0e" : "#09090b"}
                                fillOpacity={isSelected ? 0.9 : 0.8}
                                stroke={isSelected ? "#eab308" : isHovered ? "#52525b" : "#27272a"}
                                strokeWidth={1}
                              />
                              <text
                                textAnchor="middle"
                                dy={30}
                                fill={isSelected ? "#fef08a" : isHovered ? "#ffffff" : "#d4d4d8"}
                                fontSize="9.5"
                                fontWeight={isSelected ? "bold" : "500"}
                                className="pointer-events-none"
                              >
                                {displayName}
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      {/* 3. Floating Detail Tooltip Popover (Hien thi chi tiet khi click Node) */}
      <AnimatePresence mode="wait">
        {selectedRepo && (
          <motion.div
            key={selectedRepo.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-30 p-5 rounded-2xl bg-zinc-900/95 border border-yellow-500/40 shadow-2xl backdrop-blur-2xl text-zinc-100 space-y-3.5"
          >
            {/* Header: Title + Language Badge + Close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/80 text-yellow-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight leading-none">
                    {selectedRepo.name}
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {selectedRepo.language}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedRepo(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label={t(`${p}.close`, { defaultValue: "Đóng" })}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {selectedRepo.description}
            </p>

            {/* Stats: Stars & Forks */}
            <div className="flex items-center gap-4 text-xs text-zinc-400 border-y border-zinc-800/80 py-2">
              <div className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span>{selectedRepo.stars} {t(`${p}.stars`, { defaultValue: "stars" })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                <span>{selectedRepo.forks} {t(`${p}.forks`, { defaultValue: "forks" })}</span>
              </div>
            </div>

            {/* Actions: Live Demo + View Repo */}
            <div className="flex items-center gap-2.5 pt-1">
              {selectedRepo.homepage ? (
                <a
                  href={selectedRepo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-zinc-950 font-bold text-xs tracking-tight flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20 transition-all cursor-pointer"
                >
                  <span>{t(`${p}.live_demo`, { defaultValue: "Xem Demo" })}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}

              <a
                href={selectedRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white font-medium text-xs tracking-tight flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{t(`${p}.view_repo`, { defaultValue: "Mã nguồn" })}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
