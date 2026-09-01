"use client";

import { useState, useRef, useEffect } from "react";
import { VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function AmbientSoundPlayer() {
  const { i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isVi = i18n.language === "vi";

  // Gửi lệnh play / pause qua YouTube postMessage
  const togglePlay = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    if (isPlaying) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
        "*"
      );
      setIsPlaying(false);
    } else {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: "" }),
        "*"
      );
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <>
      {/* Hidden YouTube IFrame */}
      <div className="hidden pointer-events-none" aria-hidden="true">
        <iframe
          ref={iframeRef}
          width="200"
          height="200"
          src="https://www.youtube-nocookie.com/embed/XCRZQW3_Ur4?enablejsapi=1&loop=1&playlist=XCRZQW3_Ur4&origin=http://localhost:3000"
          title="Ambient Music Player"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Floating Ambient Widget (Bottom Left) */}
      <motion.div
        className="fixed bottom-5 left-5 z-[90]"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <button
          onClick={togglePlay}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl cursor-pointer ${
            isPlaying
              ? "bg-zinc-950/90 border-yellow-500/40 text-yellow-400 shadow-yellow-500/10"
              : "bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
          }`}
          aria-label="Toggle Ambient Music"
        >
          {/* Hardware-accelerated GPU scaleY Equalizer Bars */}
          {isPlaying ? (
            <div className="flex items-end gap-[3px] h-3.5 w-3.5 justify-center py-0.5">
              <motion.div
                className="w-[2.5px] h-full bg-yellow-400 rounded-full origin-bottom will-change-transform"
                animate={{ scaleY: [0.3, 1, 0.4, 0.9, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              />
              <motion.div
                className="w-[2.5px] h-full bg-yellow-400 rounded-full origin-bottom will-change-transform"
                animate={{ scaleY: [0.8, 0.3, 1, 0.5, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="w-[2.5px] h-full bg-yellow-400 rounded-full origin-bottom will-change-transform"
                animate={{ scaleY: [0.4, 0.9, 0.3, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          )}

          {/* Label text */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider leading-none">
              {isPlaying ? "Lo-Fi Vibe" : (isVi ? "Âm thanh" : "Ambient")}
            </span>
            <span className="text-[8px] font-mono text-zinc-500 leading-none mt-0.5">
              {isPlaying ? (isVi ? "Đang phát" : "Playing") : (isVi ? "Bấm để bật" : "Click to play")}
            </span>
          </div>
        </button>
      </motion.div>
    </>
  );
}
