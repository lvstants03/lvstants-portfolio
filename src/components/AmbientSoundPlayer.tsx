"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function AmbientSoundPlayer() {
  const { i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [origin, setOrigin] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isVi = i18n.language === "vi";

  // Hàm điều chỉnh âm lượng Iframe qua postMessage
  const setVolumeLevel = useCallback((level: number) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "setVolume", args: [level] }),
      "*"
    );
  }, []);

  const startPlay = useCallback(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "playVideo", args: "" }),
      "*"
    );
    // Hạ âm lượng xuống 50% luôn theo yêu cầu
    setVolumeLevel(50);
    setIsPlaying(true);
  }, [setVolumeLevel]);

  const stopPlay = useCallback(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
      "*"
    );
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlay();
    } else {
      startPlay();
    }
  }, [isPlaying, startPlay, stopPlay]);

  useEffect(() => {
    setIsReady(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);

      // Tự động phát nhạc ngay khi người dùng chạm hoặc tương tác lần đầu
      const handleFirstInteraction = () => {
        startPlay();
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
        window.removeEventListener("scroll", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
      };

      window.addEventListener("click", handleFirstInteraction, { once: true, passive: true });
      window.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
      window.addEventListener("scroll", handleFirstInteraction, { once: true, passive: true });
      window.addEventListener("keydown", handleFirstInteraction, { once: true, passive: true });

      // Lắng nghe lệnh từ Voice AI ("Bật nhạc" / "Tắt nhạc")
      const handleVoiceMusic = (e: Event) => {
        const ce = e as CustomEvent<{ play?: boolean }>;
        if (ce.detail?.play === true) {
          startPlay();
        } else if (ce.detail?.play === false) {
          stopPlay();
        } else {
          togglePlay();
        }
      };

      // Kỹ thuật Audio Ducking: Giảm âm lượng xuống 15% khi người dùng nói, khôi phục 50% khi xong
      const handleDuckMusic = (e: Event) => {
        const ce = e as CustomEvent<{ duck?: boolean }>;
        if (ce.detail?.duck) {
          setVolumeLevel(15);
        } else {
          setVolumeLevel(50);
        }
      };

      window.addEventListener("portfolio:toggle-music", handleVoiceMusic);
      window.addEventListener("portfolio:duck-music", handleDuckMusic);

      return () => {
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
        window.removeEventListener("scroll", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
        window.removeEventListener("portfolio:toggle-music", handleVoiceMusic);
        window.removeEventListener("portfolio:duck-music", handleDuckMusic);
      };
    }
  }, [setVolumeLevel, startPlay, stopPlay, togglePlay]);

  if (!isReady) return null;

  // URL YouTube embed với dynamic origin và enablejsapi
  const youtubeSrc = `https://www.youtube-nocookie.com/embed/XCRZQW3_Ur4?enablejsapi=1&loop=1&playlist=XCRZQW3_Ur4&playsinline=1${
    origin ? `&origin=${encodeURIComponent(origin)}` : ""
  }`;

  return (
    <>
      {/* Live IFrame trong DOM */}
      <div 
        className="fixed -bottom-10 -left-10 w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-[-1]" 
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          width="200"
          height="200"
          src={youtubeSrc}
          title="Ambient Music Player"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
        />
      </div>

      {/* Floating Ambient Widget (Bottom Left) - Nhỏ gọn, 50% volume */}
      <motion.div
        className="fixed bottom-5 left-5 z-[90]"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <button
          onClick={togglePlay}
          className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-xl cursor-pointer ${
            isPlaying
              ? "bg-zinc-950/90 border-yellow-500/40 text-yellow-400 shadow-yellow-500/10"
              : "bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
          }`}
          aria-label="Toggle Ambient Music"
        >
          {/* Hardware-accelerated GPU scaleY Equalizer Bars */}
          {isPlaying ? (
            <div className="flex items-end gap-[2.5px] h-3.5 w-3 justify-center py-0.5">
              <motion.div
                className="w-[2px] h-full bg-yellow-400 rounded-full origin-bottom will-change-transform"
                animate={{ scaleY: [0.3, 1, 0.4, 0.9, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              />
              <motion.div
                className="w-[2px] h-full bg-yellow-400 rounded-full origin-bottom will-change-transform"
                animate={{ scaleY: [0.8, 0.3, 1, 0.5, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="w-[2px] h-full bg-yellow-400 rounded-full origin-bottom will-change-transform"
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
              {isPlaying ? "Lo-Fi 50%" : (isVi ? "Âm thanh" : "Ambient")}
            </span>
            <span className="text-[8px] font-mono text-zinc-500 leading-none mt-0.5">
              {isPlaying ? (isVi ? "Âm lượng 50%" : "Volume 50%") : (isVi ? "Bấm để bật" : "Click to play")}
            </span>
          </div>
        </button>
      </motion.div>
    </>
  );
}
