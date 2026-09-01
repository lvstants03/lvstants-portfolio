"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, Sparkles, X, Radio, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AIState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING";

export default function VoiceAIAssistant() {
  const [state, setState] = useState<AIState>("IDLE");
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [aiSpeech, setAiSpeech] = useState("");
  const [showToast, setShowToast] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isLiveActiveRef = useRef(false);
  const stateRef = useRef<AIState>("IDLE");
  const transcriptBufferRef = useRef<string>("");

  useEffect(() => {
    isLiveActiveRef.current = isLiveActive;
  }, [isLiveActive]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Khởi động lắng nghe an toàn
  const safeStartListening = useCallback(() => {
    if (!isLiveActiveRef.current) return;

    if (recognitionRef.current) {
      try {
        transcriptBufferRef.current = "";
        recognitionRef.current.lang = "vi-VN";
        recognitionRef.current.start();
      } catch (err) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
        setTimeout(() => {
          if (isLiveActiveRef.current && stateRef.current !== "SPEAKING" && stateRef.current !== "THINKING") {
            try {
              transcriptBufferRef.current = "";
              recognitionRef.current.start();
            } catch (_) {}
          }
        }, 300);
      }
    }
  }, []);

  // Khởi tạo Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "vi-VN";

        recognition.onstart = () => {
          setState("LISTENING");
          setShowToast(true);
        };

        recognition.onresult = (event: any) => {
          let currentText = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentText += event.results[i][0].transcript;
          }
          if (currentText.trim()) {
            transcriptBufferRef.current = currentText.trim();
            setUserSpeech(currentText.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech Error:", event.error);
          if (isLiveActiveRef.current && stateRef.current !== "SPEAKING" && stateRef.current !== "THINKING") {
            setTimeout(safeStartListening, 500);
          }
        };

        recognition.onend = () => {
          const finalText = transcriptBufferRef.current.trim();
          if (finalText) {
            transcriptBufferRef.current = "";
            handleSendToAI(finalText);
          } else if (isLiveActiveRef.current && stateRef.current !== "SPEAKING" && stateRef.current !== "THINKING") {
            setTimeout(safeStartListening, 300);
          } else {
            setState("IDLE");
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [safeStartListening]);

  // Bật / Tắt Chế độ Live Voice AI Trực tiếp
  const toggleLiveVoice = () => {
    if (isLiveActive) {
      // TẮT HOÀN TOÀN
      setIsLiveActive(false);
      isLiveActiveRef.current = false;
      setState("IDLE");
      setShowToast(false);
      transcriptBufferRef.current = "";

      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    } else {
      // BẬT CHẾ ĐỘ LIVE CONVERSATION
      setIsLiveActive(true);
      isLiveActiveRef.current = true;
      setShowToast(true);
      
      const welcome = "Chào bạn! Tôi là Voice AI của Lý Văn Mỹ. Bạn hãy nói câu hỏi hoặc yêu cầu tôi mở các mục trên trang web nhé.";
      setAiSpeech(welcome);
      speakAnswer(welcome);
    }
  };

  // Gửi câu hỏi đến Server AI API & Tự động Điều khiển Màn hình
  const handleSendToAI = async (message: string) => {
    setState("THINKING");
    setShowToast(true);

    try {
      const res = await fetch("/api/voice-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language: "vi" }),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      const answer = data.response || "Tôi đã ghi nhận yêu cầu của bạn.";
      setAiSpeech(answer);

      // Tự động Cuộn Màn hình theo Khẩu lệnh (Voice Screen Navigation)
      if (data.action === "NAVIGATE_SECTION" && data.target) {
        const element = document.getElementById(data.target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else if (data.action === "DOWNLOAD_CV") {
        const link = document.createElement("a");
        link.href = "/Lý_Văn_Mỹ_cv.pdf";
        link.download = "Ly_Van_My_CV.pdf";
        link.click();
      }

      speakAnswer(answer);
    } catch (err) {
      console.error(err);
      const fallback = "Tôi đã ghi nhận. Bạn có thể nói lại câu hỏi rõ hơn nhé.";
      setAiSpeech(fallback);
      speakAnswer(fallback);
    }
  };

  // Phát âm thanh giọng đọc TTS & Tự động Mở lại Mic sau khi nói xong
  const speakAnswer = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setState("IDLE");
      if (isLiveActiveRef.current) setTimeout(safeStartListening, 400);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes("vi") || v.lang.includes("VI"));
    if (viVoice) utterance.voice = viVoice;

    utterance.onstart = () => setState("SPEAKING");

    // KHI AI NÓI XONG: TỰ ĐỘNG BẬT MIC LẮNG NGHE TIẾP
    utterance.onend = () => {
      if (isLiveActiveRef.current) {
        setState("LISTENING");
        setTimeout(safeStartListening, 400);
      } else {
        setState("IDLE");
      }
    };

    utterance.onerror = () => {
      if (isLiveActiveRef.current) {
        setTimeout(safeStartListening, 400);
      } else {
        setState("IDLE");
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    { label: "Dự án Cảng Mỹ Thủy", text: "Mở dự án cảng Mỹ Thủy" },
    { label: "Kinh nghiệm làm việc", text: "Xem kinh nghiệm làm việc của bạn" },
    { label: "Ma trận Kỹ thuật", text: "Mở ma trận kỹ năng công nghệ" },
    { label: "Tải file CV", text: "Tải file CV của Lý Văn Mỹ" },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[95] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Floating Subtitles Toast Bubble */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto max-w-sm sm:max-w-md w-auto p-4 rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl text-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-yellow-400 font-mono font-semibold text-[11px]">
                <Radio className={`w-3.5 h-3.5 ${isLiveActive ? "text-emerald-400 animate-pulse" : "text-zinc-500"}`} />
                <span>Trợ lý Tiếng Việt ({isLiveActive ? "Live Lắng nghe" : "Tạm dừng"})</span>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="p-1 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {userSpeech && (
              <div className="flex items-start gap-2 text-zinc-400">
                <span className="font-mono text-zinc-500 shrink-0 uppercase text-[10px]">Bạn nói:</span>
                <span className="text-zinc-200 font-medium">{userSpeech}</span>
              </div>
            )}

            {aiSpeech ? (
              <div className="flex items-start gap-2 text-yellow-400 pt-1">
                <span className="font-mono text-yellow-500 shrink-0 uppercase text-[10px]">AI:</span>
                <span className="text-zinc-300 leading-relaxed">{aiSpeech}</span>
              </div>
            ) : state === "THINKING" ? (
              <div className="text-zinc-500 italic py-1">
                AI đang suy nghĩ câu trả lời...
              </div>
            ) : null}

            {/* Quick Test Chips */}
            <div className="pt-2 border-t border-zinc-900 flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserSpeech(p.text);
                    handleSendToAI(p.text);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{p.label}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-zinc-500" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct 1-Click Floating Voice Pill Button */}
      <motion.button
        onClick={toggleLiveVoice}
        whileTap={{ scale: 0.96 }}
        className={`pointer-events-auto group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer ${
          isLiveActive
            ? state === "LISTENING"
              ? "bg-red-950/90 border-red-500 text-red-400 shadow-red-500/20 ring-2 ring-red-500/40"
              : state === "SPEAKING"
              ? "bg-yellow-950/90 border-yellow-400 text-yellow-400 shadow-yellow-500/20 ring-2 ring-yellow-400/30"
              : "bg-emerald-950/90 border-emerald-500 text-emerald-400 shadow-emerald-500/20"
            : "bg-zinc-950/90 hover:bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 text-white"
        }`}
        aria-label="Toggle Live Voice AI"
      >
        {/* Animated Glow Ring */}
        <div className={`absolute inset-0 rounded-full blur-md -z-10 transition-colors ${
          isLiveActive ? (state === "LISTENING" ? "bg-red-500/30 animate-pulse" : "bg-yellow-500/20") : "bg-yellow-500/10"
        }`} />

        {/* State Icon */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold transition-colors ${
          isLiveActive
            ? state === "LISTENING"
              ? "bg-red-500 text-white animate-pulse"
              : state === "SPEAKING"
              ? "bg-yellow-400 text-zinc-950"
              : "bg-emerald-500 text-zinc-950"
            : "bg-yellow-400 text-zinc-950"
        }`}>
          {isLiveActive ? (
            state === "SPEAKING" ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Label & Status */}
        <div className="flex flex-col text-left pr-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider leading-none">
            {isLiveActive
              ? state === "LISTENING"
                ? "Đang nghe bạn..."
                : state === "THINKING"
                ? "Đang xử lý..."
                : state === "SPEAKING"
                ? "AI đang nói..."
                : "Live Voice: Bật"
              : "Voice AI Tiếng Việt"}
          </span>
          <span className="text-[8px] font-mono text-zinc-400 leading-none mt-0.5">
            {isLiveActive
              ? "Bấm để Tắt hoàn toàn"
              : "Bấm 1 lần để trò chuyện liên tục"}
          </span>
        </div>
      </motion.button>

    </div>
  );
}
