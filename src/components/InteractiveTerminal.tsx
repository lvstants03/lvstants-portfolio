"use client";

import { useState, useEffect } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export default function InteractiveTerminal() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "tech" | "contact">("profile");

  const terminalTabs = {
    profile: `{
  "name": "Ly Van My",
  "alias": "Lunartist",
  "role": "Fullstack Software Engineer",
  "education": "FPT University HCM",
  "gpa": "Good",
  "status": "Ready for challenges",
  "location": "Ho Chi Minh City, VN"
}`,
    tech: `// Core Technical Matrix
const TechStack = {
  frontend: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"],
  backend: [".NET 9.0", "NestJS", "Node.js", "Microservices"],
  database: ["PostgreSQL", "MongoDB", "Redis", "Prisma"],
  devops: ["Docker", "GitHub Actions", "CI/CD", "AWS"]
};`,
    contact: `curl -X POST https://api.lunarist.dev/hire \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "lyvanmy357@gmail.com",
    "github": "https://github.com/lvstants03",
    "status": "Let us build something remarkable."
  }'`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalTabs[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-zinc-950/90 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl font-mono text-xs text-zinc-300">
      {/* MacOS Terminal Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600" />
          <span className="text-[11px] text-zinc-500 ml-2 font-mono select-none">lunarist@dev: ~</span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          {(["profile", "tech", "contact"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-yellow-500 text-black shadow-sm font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-yellow-400 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-5 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-zinc-300">
        <div className="flex items-center gap-2 text-yellow-400/90 mb-3 select-none">
          <span className="text-emerald-400">➜</span>
          <span className="text-cyan-400">~</span>
          <span className="text-zinc-400">cat {activeTab}.json</span>
        </div>
        <pre className="text-zinc-300 font-mono whitespace-pre-wrap selection:bg-yellow-500/30 selection:text-yellow-400">
          <code>{terminalTabs[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
}
