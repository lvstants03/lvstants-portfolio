"use client";

import { useEffect, useState, useRef } from "react";

export default function SpotlightEffect() {
  const [mounted, setMounted] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          if (spotlightRef.current) {
            spotlightRef.current.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`;
          }
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {/* GPU Accelerated Hardware-rendered Spotlight */}
      <div
        ref={spotlightRef}
        className="hidden md:block absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-60 transition-opacity duration-300 will-change-transform pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(234, 179, 8, 0.08) 0%, rgba(234, 179, 8, 0.02) 45%, transparent 70%)",
        }}
      />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
