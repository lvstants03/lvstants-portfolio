"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { 
  Building2, GraduationCap, Cpu, CheckCircle2, 
  Mail, Github, Linkedin, Monitor, Server, Palette, Sparkles 
} from "lucide-react";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import aboutData from "@/data/about.json";

export default function AboutUsPage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <main className="min-h-screen bg-[#09090b]" />;
  }

  const isVi = i18n.language === "vi";

  return (
    <main className="min-h-screen pt-28 md:pt-36 pb-20 bg-[#09090b] text-zinc-100 relative selection:bg-yellow-500/20 selection:text-yellow-400 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-yellow-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10 space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>01 // {isVi ? "HỒ SƠ KỸ SƯ" : "ENGINEERING DOSSIER"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isVi ? "Kiến tạo phần mềm bền vững từ" : "Engineering Resilient Software with"}{" "}
            <span className="text-yellow-400">
              {isVi ? "Tư duy Hệ thống" : "Systems Thinking"}
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            {isVi
              ? "Tôi là Lý Văn Mỹ (LVSTANTS / Lunartist), một Kỹ sư phần mềm Full-stack với định hướng trở thành Kiến trúc sư phần mềm (Software Architect). Tôi chuyên sâu vào phát triển các hệ thống doanh nghiệp, kiến trúc microservices và những trải nghiệm web có hiệu năng vượt trội."
              : "I am Ly Van My (LVSTANTS / Lunartist), a Full-stack Software Engineer aspiring to become a Software Architect. Specializing in enterprise systems, microservices architectures, and performance-first web experiences."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:lyvanmy357@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-yellow-500/10"
            >
              <Mail className="w-4 h-4" />
              <span>{isVi ? "Gửi Email Liên hệ" : "Get in Touch"}</span>
            </a>

            <a
              href="https://github.com/lvstants03"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/m%E1%BB%B9-l%C3%BD-v%C4%83n-1b5427242/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Bento Grid Layer 1: Core Philosophy & Interactive Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Philosophy Card (Col 6) */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col justify-between shadow-sm backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-yellow-400" />
                <span>{isVi ? "Triết lý Kỹ thuật" : "Engineering Philosophy"}</span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                {isVi 
                  ? "Kiến trúc Mở rộng, Mã nguồn Sạch & Hiệu năng Đỉnh cao" 
                  : "Scalable Architecture, Clean Code & Peak Performance"}
              </h2>

              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {isVi
                  ? "Mỗi dòng mã được kiến tạo đều hướng tới tính bền vững, khả năng module hóa cao và kiểm thử chặt chẽ. Tôi luôn ưu tiên tối ưu hóa Core Web Vitals, loại bỏ hiện tượng giật giao diện (Layout Shifts) và đảm bảo tính mở rộng dài hạn cho hệ thống backend."
                  : "Every line of code is engineered for maintainability, modularity, and testability. I prioritize Core Web Vitals optimization, zero layout shifts, and long-term backend scalability."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800/70 text-xs">
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{isVi ? "Kiến trúc Sạch" : "Clean Architecture"}</span>
                    <span className="text-zinc-500 text-[11px]">{isVi ? "Dễ bảo trì, module hóa, kiểm thử" : "Maintainable, Modular, Testable"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">{isVi ? "Không Hồi quy" : "Zero Regression"}</span>
                    <span className="text-zinc-500 text-[11px]">{isVi ? "An toàn kiểu dữ liệu chặt chẽ" : "Strict Type-safety & Audits"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Stack: NestJS, .NET 9.0, Next.js 15</span>
              <span>DB: PostgreSQL, Redis</span>
            </div>
          </div>

          {/* Terminal Widget Card (Col 6) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <InteractiveTerminal />
          </div>
        </div>

        {/* Bento Grid Layer 2: Enterprise Milestones & Case Studies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-yellow-400" />
            <span>{isVi ? "Dấu ấn Thực chiến Doanh nghiệp" : "Enterprise Case Studies"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Project 1: MTIP TOS */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-500/20 rounded">
                  PORT LOGISTICS & TOS
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {isVi ? "Cảng Quốc tế Mỹ Thủy (MTIP)" : "My Thuy International Port"}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {isVi
                    ? "Kiến trúc các phân hệ cốt lõi của Hệ thống điều hành cảng biển (TOS), lập trình Bản đồ 2D Spatial-Temporal BA Map trực quan hóa hơn 1.200m cầu bến và tự động hóa quy trình tính cước đa bậc phức tạp."
                    : "Architected core TOS modules, engineered 2D spatial-temporal Berth Allocation Map over 1,200m+ berth line, and automated multi-tier tariff calculation pipelines."}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60">
                {[".NET 9.0", "Microservices", "Spatial Math", "PostgreSQL"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Project 2: BIDV Integration */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-400/10 text-blue-400 border border-blue-500/20 rounded">
                  FINTECH & BANKING
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {isVi ? "Tích hợp Giao diện Ngân hàng BIDV" : "BIDV Banking Interface"}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {isVi
                    ? "Xây dựng dashboard tài chính bảo mật cao kết nối trực tiếp với hệ thống BIDV. Chuyển hóa đặc tả ngân hàng thành giao diện trực quan, đạt chuẩn tiếp cận WCAG và phản hồi mượt mà."
                    : "Delivered high-security banking dashboard interfaces integrated with BIDV systems. Converted complex financial specs into accessible (WCAG) responsive components."}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60">
                {["Next.js", "TypeScript", "WCAG", "Tailwind CSS"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Project 3: SmartGate */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-400/10 text-emerald-400 border border-emerald-500/20 rounded">
                  INDUSTRIAL AUTOMATION
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {isVi ? "SmartGate - Cảng Hải Phòng" : "SmartGate - Hai Phong Port"}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {isVi
                    ? "Tự động hóa toàn bộ quy trình kiểm soát container tại cổng cảng nhờ camera OCR tốc độ cao, tinh chỉnh đường ống dữ liệu PostgreSQL để tối đa hóa tốc độ xử lý cổng."
                    : "Automated container gate-in/gate-out workflows powered by high-speed OCR camera integration and optimized backend throughput."}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60">
                {["OCR Camera", "Node.js", "PostgreSQL", "Automation"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layer 3: Education & 3 Technical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Education Box (Col 5) */}
          <div className="md:col-span-5 p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-yellow-400" />
                <span>{isVi ? "Nền tảng Giáo dục Chính quy" : "Formal Education"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-4">
                <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white p-1 border border-zinc-700">
                  <Image
                    src={aboutData.education.logo}
                    alt="Đại học FPT"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-snug">
                    {isVi ? "Cử nhân - Kỹ thuật Phần mềm" : "Bachelor - Software Engineering"}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{aboutData.education.university}</p>
                  <span className="text-[11px] font-mono text-yellow-400 font-bold block mt-1">
                    2021 - 2025 ({isVi ? "Đã tốt nghiệp" : "Graduated"})
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">{isVi ? "Chuyên ngành" : "Major"}</span>
                  <span className="text-zinc-200 font-medium">{isVi ? "Kỹ thuật Phần mềm" : "Software Engineering"}</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">{isVi ? "Định hướng Nghề nghiệp" : "Career Vision"}</span>
                  <span className="text-yellow-400 font-mono font-semibold">Software Architect</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars (Col 7) */}
          <div className="md:col-span-7 p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>{isVi ? "3 Trụ cột Năng lực Chuyên môn" : "3 Pillars of Expertise"}</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-yellow-400 shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isVi ? "Kỹ thuật Frontend" : "Frontend Engineering"}
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {isVi 
                      ? "Next.js 15, React 19, TypeScript, Tailwind CSS, tiêu chuẩn tiếp cận WCAG, tối ưu chỉ số LCP dưới 1 giây."
                      : "Next.js 15, React 19, TypeScript, Tailwind CSS, WCAG accessibility, sub-second LCP."}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-yellow-400 shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isVi ? "Backend & Hệ thống Phân tán" : "Backend & Systems"}
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {isVi
                      ? "NestJS, .NET 9.0, Node.js, Kiến trúc Microservices, Redis Caching, cơ sở dữ liệu PostgreSQL & SQL Server."
                      : "NestJS, .NET 9.0, Node.js, Microservices, Redis Caching, PostgreSQL, SQL Server."}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-yellow-400 shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isVi ? "Thiết kế Sản phẩm & Trải nghiệm (UI/UX)" : "Product & System Design"}
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {isVi
                      ? "Nghiên cứu người dùng, Wireframing, Tạo mẫu tương tác độ chân thực cao, Thiết kế hệ thống Design System Tokens."
                      : "Wireframing, High-fidelity prototyping, Design System Tokens, Developer Handoff."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 text-center space-y-5 relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isVi ? "Sẵn sàng hợp tác cùng kiến tạo sản phẩm vượt trội?" : "Ready to Build Something Remarkable Together?"}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              {isVi 
                ? "Hãy liên hệ với tôi để cùng trao đổi về cơ hội việc làm, tư vấn kiến trúc hệ thống hoặc các dự án công nghệ đột phá."
                : "Feel free to reach out for career opportunities, enterprise architecture consulting, or engineering collaboration."}
            </p>
            <div className="pt-2 flex justify-center items-center gap-3">
              <a
                href="mailto:lyvanmy357@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-yellow-500/10"
              >
                <Mail className="w-4 h-4" />
                <span>lyvanmy357@gmail.com</span>
              </a>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs transition-colors"
              >
                <span>{isVi ? "Khám phá Portfolio" : "Explore Portfolio"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}