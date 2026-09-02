"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type AIState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING";

export default function VoiceAIAssistant() {
  const { i18n } = useTranslation();
  const [state, setState] = useState<AIState>("IDLE");
  const [isLiveActive, setIsLiveActive] = useState(true); // Mic luôn tự mở!
  const [isMuted, setIsMuted] = useState(false); // Chế độ Lắng nghe Thầm lặng
  const [userSpeech, setUserSpeech] = useState("");
  const [aiSpeech, setAiSpeech] = useState("");
  const [showToast, setShowToast] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isLiveActiveRef = useRef(true);
  const isMutedRef = useRef(false);
  const stateRef = useRef<AIState>("IDLE");
  const transcriptBufferRef = useRef<string>("");
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const vadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSessionActiveRef = useRef(false);
  const isStartingRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isLiveActiveRef.current = isLiveActive;
  }, [isLiveActive]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Tự động đóng Toast sau 4 giây
  const triggerToast = (userText: string, aiText: string) => {
    setUserSpeech(userText);
    setAiSpeech(aiText);
    setShowToast(true);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  // Khởi động lắng nghe an toàn liên tục (chống gọi start() trùng lặp tuyệt đối)
  const safeStartListening = useCallback(() => {
    if (!isLiveActiveRef.current) return;
    if (stateRef.current === "SPEAKING" || stateRef.current === "THINKING") return;
    if (isSessionActiveRef.current || isStartingRef.current) return;

    if (recognitionRef.current) {
      try {
        isStartingRef.current = true;
        transcriptBufferRef.current = "";
        recognitionRef.current.lang = "vi-VN";
        recognitionRef.current.start();
      } catch (err: any) {
        isStartingRef.current = false;
        if (err?.name === "InvalidStateError") {
          isSessionActiveRef.current = true;
        }
      }
    }
  }, []);

  // Thực thi hành động hệ thống được trả về từ AI
  const executeAction = useCallback((action: string, target: string | null) => {
    switch (action) {
      case "TOGGLE_VOICE":
        if (target === "mute") {
          setIsMuted(true);
          if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
        } else if (target === "unmute") {
          setIsMuted(false);
        }
        break;

      case "TOGGLE_MUSIC":
        window.dispatchEvent(
          new CustomEvent("portfolio:toggle-music", { detail: { play: target === "play" } })
        );
        break;

      case "TOGGLE_CAMERA":
        window.dispatchEvent(
          new CustomEvent("portfolio:toggle-camera", { detail: { enable: target === "enable" } })
        );
        break;

      case "FILTER_PROJECTS":
        window.dispatchEvent(
          new CustomEvent("portfolio:filter-projects", { detail: { target } })
        );
        break;

      case "CONTACT_ACTION":
        if (target === "email") {
          window.location.href = "mailto:lyvanmy357@gmail.com?subject=Liên hệ hợp tác qua Portfolio";
        } else if (target === "call") {
          window.location.href = "tel:0915461265";
        } else if (target === "github") {
          window.open("https://github.com/lvstants03", "_blank");
        } else if (target === "linkedin") {
          window.open("https://www.linkedin.com/in/m%E1%BB%B9-l%C3%BD-v%C4%83n-1b5427242/", "_blank");
        } else if (target === "facebook") {
          window.open("https://www.facebook.com/Myx2406/", "_blank");
        }
        break;

      case "SCROLL_PAGE":
        if (target === "down") {
          window.scrollBy({ top: 450, behavior: "smooth" });
        } else if (target === "up") {
          window.scrollBy({ top: -450, behavior: "smooth" });
        }
        break;

      case "NAVIGATE_SECTION":
        if (target) {
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        break;

      case "DOWNLOAD_CV":
        const link = document.createElement("a");
        link.href = "/Lý_Văn_Mỹ_cv.pdf";
        link.download = "Ly_Van_My_CV.pdf";
        link.click();
        break;

      case "CHANGE_LANGUAGE":
        if (target) {
          i18n.changeLanguage(target);
        }
        break;

      default:
        break;
    }
  }, [i18n]);

  // Gửi câu hỏi đến Server AI API & Tự động Điều khiển Hệ thống
  const handleSendToAI = useCallback(async (message: string) => {
    setState("THINKING");

    try {
      const res = await fetch("/api/voice-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, language: "vi" }),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      const answer = data.response || "Tôi đã thực hiện yêu cầu của bạn.";
      
      triggerToast(message, answer);

      // Thực thi hành động hệ thống
      if (data.action) {
        executeAction(data.action, data.target);
      }

      // Nếu đang im lặng hoặc lệnh là MUTE: Không phát tiếng loa
      if (isMutedRef.current || (data.action === "TOGGLE_VOICE" && data.target === "mute")) {
        setState("IDLE");
        setTimeout(safeStartListening, 300);
      } else {
        speakAnswer(answer);
      }
    } catch (err) {
      console.error(err);
      const fallback = "Tôi đã ghi nhận. Bạn có thể nói lại rõ hơn nhé.";
      triggerToast(message, fallback);
      if (!isMutedRef.current) {
        speakAnswer(fallback);
      } else {
        setState("IDLE");
        setTimeout(safeStartListening, 300);
      }
    }
  }, [executeAction, safeStartListening]);

  // Phát âm thanh giọng đọc TTS tự nhiên & Tự động mở lại Mic sau khi nói xong
  const speakAnswer = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis || isMutedRef.current) {
      setState("IDLE");
      if (isLiveActiveRef.current) setTimeout(safeStartListening, 400);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1.02; // Tốc độ tự nhiên, ấm áp
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(
      (v) =>
        v.lang.includes("vi") &&
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("HoaiMy") || v.name.includes("Online"))
    ) || voices.find((v) => v.lang.includes("vi"));
    if (viVoice) utterance.voice = viVoice;

    utterance.onstart = () => setState("SPEAKING");

    // Khi AI nói xong: TỰ ĐỘNG BẬT MIC LẮNG NGHE TIẾP
    utterance.onend = () => {
      if (isLiveActiveRef.current) {
        setState("LISTENING");
        setTimeout(safeStartListening, 350);
      } else {
        setState("IDLE");
      }
    };

    utterance.onerror = () => {
      if (isLiveActiveRef.current) {
        setTimeout(safeStartListening, 350);
      } else {
        setState("IDLE");
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Khởi tạo Web Speech Recognition & Auto-Start Lắng Nghe
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "vi-VN";

        recognition.onstart = () => {
          isStartingRef.current = false;
          isSessionActiveRef.current = true;
          setState("LISTENING");
        };

        recognition.onresult = (event: any) => {
          if (stateRef.current === "SPEAKING" || stateRef.current === "THINKING") return;

          // Khi người dùng cất tiếng nói: Hạ âm lượng nhạc Lo-Fi xuống 15% ngay lập tức
          window.dispatchEvent(new CustomEvent("portfolio:duck-music", { detail: { duck: true } }));

          let interimText = "";
          let finalChunk = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalChunk += transcript + " ";
            } else {
              interimText += transcript;
            }
          }

          const currentDisplay = (finalChunk || interimText).trim();
          if (currentDisplay) {
            transcriptBufferRef.current = currentDisplay;
            setUserSpeech(currentDisplay);
          }

          // Khi phát hiện dứt câu (isFinal) hoặc sau khoảng lặng 900ms: Gửi AI
          if (finalChunk.trim()) {
            const textToSend = finalChunk.trim();
            transcriptBufferRef.current = "";
            if (vadTimeoutRef.current) clearTimeout(vadTimeoutRef.current);
            handleSendToAI(textToSend);
          } else if (interimText.trim()) {
            if (vadTimeoutRef.current) clearTimeout(vadTimeoutRef.current);
            vadTimeoutRef.current = setTimeout(() => {
              const pendingText = transcriptBufferRef.current.trim();
              if (pendingText && stateRef.current !== "SPEAKING" && stateRef.current !== "THINKING") {
                transcriptBufferRef.current = "";
                handleSendToAI(pendingText);
              }
            }, 900);
          }
        };

        recognition.onerror = (event: any) => {
          // Bỏ qua hoàn toàn aborted và no-speech (sự kiện bình thường, không log, không restart dồn dập)
          if (event.error === "aborted" || event.error === "no-speech") {
            return;
          }

          console.warn("Speech recognition notice:", event.error);
          window.dispatchEvent(new CustomEvent("portfolio:duck-music", { detail: { duck: false } }));

          // Khi máy chủ Google bị nghẽn mạng: Nghỉ 3 giây rồi mới thử lại
          if (event.error === "network") {
            if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(() => {
              safeStartListening();
            }, 3000);
            return;
          }

          if (event.error === "not-allowed") {
            setIsLiveActive(false);
            isLiveActiveRef.current = false;
            return;
          }

          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(safeStartListening, 1500);
        };

        recognition.onend = () => {
          isStartingRef.current = false;
          isSessionActiveRef.current = false;
          window.dispatchEvent(new CustomEvent("portfolio:duck-music", { detail: { duck: false } }));
          if (vadTimeoutRef.current) clearTimeout(vadTimeoutRef.current);

          // Với continuous = true, nếu vô tình ngắt kết nối phần cứng, restart êm dịu sau 1s
          if (isLiveActiveRef.current && stateRef.current !== "SPEAKING" && stateRef.current !== "THINKING") {
            if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = setTimeout(safeStartListening, 1000);
          } else {
            setState("IDLE");
          }
        };

        recognitionRef.current = recognition;

        // Tự động kích hoạt lắng nghe khi người dùng chạm hoặc tương tác lần đầu
        const handleAutoStart = () => {
          safeStartListening();
          window.removeEventListener("click", handleAutoStart);
          window.removeEventListener("touchstart", handleAutoStart);
          window.removeEventListener("scroll", handleAutoStart);
        };

        window.addEventListener("click", handleAutoStart, { once: true, passive: true });
        window.addEventListener("touchstart", handleAutoStart, { once: true, passive: true });
        window.addEventListener("scroll", handleAutoStart, { once: true, passive: true });

        // Khởi động thử ngay
        setTimeout(safeStartListening, 1000);
      }
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [handleSendToAI, safeStartListening]);

  // Chuyển đổi thủ công trạng thái Mute / Unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
      triggerToast("Bạn đã bật lại giọng nói", "Trợ lý Voice AI đã sẵn sàng trò chuyện cùng bạn!");
      speakAnswer("Trợ lý Voice AI đã sẵn sàng phục vụ bạn!");
    } else {
      setIsMuted(true);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      triggerToast("Đã chuyển sang Lắng nghe Thầm lặng", "Tôi vẫn đang lắng nghe các khẩu lệnh của bạn.");
    }
  };

  // Bật/tắt hoàn toàn Mic
  const toggleMicrophone = () => {
    if (isLiveActive) {
      setIsLiveActive(false);
      isLiveActiveRef.current = false;
      setState("IDLE");
      setShowToast(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    } else {
      setIsLiveActive(true);
      isLiveActiveRef.current = true;
      safeStartListening();
      triggerToast("Micro đã bật", "Voice AI đang lắng nghe bạn.");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[95] flex flex-col items-end gap-2.5 pointer-events-none">
      
      {/* Floating Subtitles Toast Bubble - Nhỏ gọn, tinh tế, tự ẩn sau 4s */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto max-w-xs sm:max-w-sm w-auto px-4 py-3 rounded-2xl bg-zinc-950/95 border border-yellow-500/30 shadow-2xl backdrop-blur-xl text-xs space-y-2"
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-1.5">
              <div className="flex items-center gap-1.5 text-yellow-400 font-mono font-semibold text-[10px]">
                <Radio className={`w-3 h-3 ${isLiveActive ? "text-emerald-400 animate-pulse" : "text-zinc-500"}`} />
                <span>
                  {isMuted ? "Lắng nghe thầm lặng" : isLiveActive ? "Voice AI đang nghe" : "Tạm dừng"}
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500">Auto-hide</span>
            </div>

            {userSpeech && (
              <div className="flex items-start gap-1.5 text-zinc-300">
                <span className="font-mono text-zinc-500 text-[10px] shrink-0">Bạn:</span>
                <span className="font-medium text-white">{userSpeech}</span>
              </div>
            )}

            {aiSpeech ? (
              <div className="flex items-start gap-1.5 text-yellow-400">
                <span className="font-mono text-yellow-500 text-[10px] shrink-0">AI:</span>
                <span className="text-zinc-200 leading-relaxed">{aiSpeech}</span>
              </div>
            ) : state === "THINKING" ? (
              <div className="text-zinc-400 italic text-[11px]">Đang xử lý yêu cầu...</div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pill Button Siêu Nhỏ Gọn Đối Xứng Với Nút Nhạc */}
      <motion.div
        className="pointer-events-auto flex items-center gap-1.5 bg-zinc-950/90 border border-zinc-800 hover:border-yellow-500/40 rounded-full px-3 py-1.5 shadow-xl backdrop-blur-xl transition-all duration-300"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Nút Mic chính (Click để toggle mic) */}
        <button
          onClick={toggleMicrophone}
          className="flex items-center gap-2 cursor-pointer group"
          aria-label="Toggle Voice AI"
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
            isLiveActive
              ? state === "LISTENING"
                ? "bg-red-500 text-white animate-pulse"
                : state === "SPEAKING"
                ? "bg-yellow-400 text-zinc-950"
                : "bg-emerald-500 text-zinc-950"
              : "bg-zinc-800 text-zinc-400"
          }`}>
            {isLiveActive ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider leading-none text-white">
              {isLiveActive
                ? isMuted
                  ? "Nghe thầm lặng"
                  : state === "LISTENING"
                  ? "Đang nghe..."
                  : state === "SPEAKING"
                  ? "AI đang nói"
                  : "Voice AI"
                : "Mic đã tắt"}
            </span>
            <span className="text-[8px] font-mono text-zinc-400 leading-none mt-0.5">
              {isMuted ? "Nói 'Bật voice' để mở loa" : isLiveActive ? "Nói 'Tắt voice' để im lặng" : "Bấm để bật"}
            </span>
          </div>
        </button>

        {/* Nút Mute Loa riêng biệt */}
        <button
          onClick={toggleMute}
          title={isMuted ? "Bật tiếng trợ lý" : "Chuyển sang Lắng nghe thầm lặng"}
          className={`ml-1 p-1 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer ${
            isMuted ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </motion.div>

    </div>
  );
}
