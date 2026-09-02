"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Hand, Eye, X, ArrowUp, ArrowDown, OctagonAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GestureState = "IDLE" | "ONE_FINGER_UP" | "TWO_FINGERS_DOWN" | "FIST_BRAKE" | "NEUTRAL";

export default function HandGestureScroll() {
  const [isActive, setIsActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gesture, setGesture] = useState<GestureState>("IDLE");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInstanceRef = useRef<any>(null);
  const handsInstanceRef = useRef<any>(null);
  const scrollAnimRef = useRef<number | null>(null);

  // Virtual Float Accumulator & Physics Engine
  const currentVelocityRef = useRef<number>(0);
  const targetVelocityRef = useRef<number>(0);
  const isFistRef = useRef<boolean>(false);
  const lastDetectedTimeRef = useRef<number>(0);
  const scrollPosRef = useRef<number>(0);
  const gestureHistoryRef = useRef<GestureState[]>([]);

  // Vòng lặp cuộn Virtual Float 60 FPS mượt tuyệt đối như băng chuyền
  useEffect(() => {
    const scrollLoop = () => {
      const now = Date.now();

      if (isFistRef.current) {
        // Phanh khẩn cấp
        currentVelocityRef.current = 0;
        targetVelocityRef.current = 0;
        scrollPosRef.current = window.scrollY;
      } else {
        // Hãm phanh mềm mại khi không có tín hiệu tay
        if (now - lastDetectedTimeRef.current > 250) {
          targetVelocityRef.current *= 0.85;
          if (Math.abs(targetVelocityRef.current) < 0.2) targetVelocityRef.current = 0;
        }

        // Tăng tốc / giảm tốc mềm mại
        currentVelocityRef.current += (targetVelocityRef.current - currentVelocityRef.current) * 0.18;

        if (Math.abs(currentVelocityRef.current) > 0.2) {
          scrollPosRef.current += currentVelocityRef.current;
          
          const maxScroll = Math.max(
            0,
            (document.documentElement?.scrollHeight || 0) - window.innerHeight
          );
          scrollPosRef.current = Math.max(0, Math.min(maxScroll, scrollPosRef.current));

          window.scrollTo(0, scrollPosRef.current);
        } else {
          scrollPosRef.current = window.scrollY;
        }
      }

      scrollAnimRef.current = requestAnimationFrame(scrollLoop);
    };

    scrollAnimRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    };
  }, []);

  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // Phân loại cử chỉ: 1 Ngón (Lên), 2 Ngón (Xuống), Nắm Tay (Dừng)
  const classifyGesture = (landmarks: any[]): GestureState => {
    const wrist = landmarks[0];

    const indexTip = landmarks[8];
    const indexPip = landmarks[6];

    const middleTip = landmarks[12];
    const middlePip = landmarks[10];

    const ringTip = landmarks[16];
    const ringPip = landmarks[14];

    const pinkyTip = landmarks[20];
    const pinkyPip = landmarks[18];

    const isIndexExtended = getDistance(indexTip, wrist) > getDistance(indexPip, wrist) * 1.05;
    const isMiddleExtended = getDistance(middleTip, wrist) > getDistance(middlePip, wrist) * 1.05;
    const isRingExtended = getDistance(ringTip, wrist) > getDistance(ringPip, wrist) * 1.05;
    const isPinkyExtended = getDistance(pinkyTip, wrist) > getDistance(pinkyPip, wrist) * 1.05;

    // 1. CỬ CHỈ NẮM TAY (FIST) -> Tất cả các ngón chính đều gập
    if (!isIndexExtended && !isMiddleExtended && !isRingExtended) {
      return "FIST_BRAKE";
    }

    // 2. CỬ CHỈ 1 NGÓN TRỎ (☝️) -> CUỘN LÊN (SCROLL UP)
    if (isIndexExtended && !isMiddleExtended && !isRingExtended) {
      return "ONE_FINGER_UP";
    }

    // 3. CỬ CHỈ 2 NGÓN TRỎ + GIỮA (✌️) -> CUỘN XUỐNG (SCROLL DOWN)
    if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return "TWO_FINGERS_DOWN";
    }

    // 4. XÒE CẢ BÀN TAY (✋) HOẶC TRẠNG THÁI KHÁC -> ĐỨNG YÊN
    return "NEUTRAL";
  };

  // Xử lý kết quả nhận diện từ MediaPipe Hands
  const onResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      lastDetectedTimeRef.current = Date.now();
      const landmarks = results.multiHandLandmarks[0];
      const rawGesture = classifyGesture(landmarks);

      // Bộ lọc trễ 3-frame Hysteresis
      const history = gestureHistoryRef.current;
      history.push(rawGesture);
      if (history.length > 3) history.shift();

      const upVotes = history.filter((g) => g === "ONE_FINGER_UP").length;
      const downVotes = history.filter((g) => g === "TWO_FINGERS_DOWN").length;
      const fistVotes = history.filter((g) => g === "FIST_BRAKE").length;

      let stableGesture: GestureState = "NEUTRAL";
      if (fistVotes >= 2) {
        stableGesture = "FIST_BRAKE";
      } else if (upVotes >= 2) {
        stableGesture = "ONE_FINGER_UP";
      } else if (downVotes >= 2) {
        stableGesture = "TWO_FINGERS_DOWN";
      } else if (rawGesture === "NEUTRAL") {
        stableGesture = "NEUTRAL";
      }

      setGesture(stableGesture);

      if (stableGesture === "FIST_BRAKE") {
        isFistRef.current = true;
        targetVelocityRef.current = 0;
        currentVelocityRef.current = 0;

        const palmX = landmarks[9].x * canvas.width;
        const palmY = landmarks[9].y * canvas.height;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(palmX, palmY, 18, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
        return;
      }

      isFistRef.current = false;

      // Vẽ chấm Laser màu vàng theo các đầu ngón tay hoạt động
      const indexTip = landmarks[8];
      const tip1X = indexTip.x * canvas.width;
      const tip1Y = indexTip.y * canvas.height;

      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(tip1X, tip1Y, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = "rgba(234, 179, 8, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tip1X, tip1Y, 12, 0, 2 * Math.PI);
      ctx.stroke();

      if (stableGesture === "TWO_FINGERS_DOWN") {
        const middleTip = landmarks[12];
        const tip2X = middleTip.x * canvas.width;
        const tip2Y = middleTip.y * canvas.height;

        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(tip2X, tip2Y, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = "rgba(234, 179, 8, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tip2X, tip2Y, 12, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Tốc độ ổn định đều đặn như băng chuyền (18px/frame)
      if (stableGesture === "ONE_FINGER_UP") {
        targetVelocityRef.current = -18;
      } else if (stableGesture === "TWO_FINGERS_DOWN") {
        targetVelocityRef.current = 18;
      } else {
        targetVelocityRef.current = 0;
      }
    } else {
      if (Date.now() - lastDetectedTimeRef.current > 300) {
        setGesture("IDLE");
        isFistRef.current = false;
        gestureHistoryRef.current = [];
      }
    }

    ctx.restore();
  }, []);

  // Khởi động Camera và MediaPipe
  const startCamera = async () => {
    setIsActive(true);
    setIsLoaded(false);
    scrollPosRef.current = window.scrollY;

    try {
      if (!(window as any).Hands) {
        await new Promise((resolve) => {
          const script1 = document.createElement("script");
          script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
          script1.crossOrigin = "anonymous";

          const script2 = document.createElement("script");
          script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
          script2.crossOrigin = "anonymous";

          document.body.appendChild(script1);
          document.body.appendChild(script2);

          script2.onload = () => resolve(true);
        });
      }

      const Hands = (window as any).Hands;
      const CameraUtils = (window as any).Camera;

      const hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      handsInstanceRef.current = hands;

      if (videoRef.current) {
        const camera = new CameraUtils(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsInstanceRef.current) {
              await handsInstanceRef.current.send({ image: videoRef.current });
            }
          },
          width: 320,
          height: 240,
        });

        await camera.start();
        cameraInstanceRef.current = camera;
        setIsLoaded(true);
      }
    } catch (err) {
      console.error("Lỗi khởi động MediaPipe Camera:", err);
      setIsActive(false);
    }
  };

  // Dừng Camera
  const stopCamera = () => {
    currentVelocityRef.current = 0;
    targetVelocityRef.current = 0;
    isFistRef.current = false;
    setGesture("IDLE");
    setIsActive(false);
    setIsLoaded(false);
    gestureHistoryRef.current = [];

    if (cameraInstanceRef.current) {
      try {
        cameraInstanceRef.current.stop();
      } catch (_) {}
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Lắng nghe lệnh từ Voice AI ("Bật camera" / "Tắt camera")
  useEffect(() => {
    const handleVoiceCamera = (e: Event) => {
      const ce = e as CustomEvent<{ enable?: boolean }>;
      if (ce.detail?.enable === true) {
        if (!isActive) startCamera();
      } else if (ce.detail?.enable === false) {
        if (isActive) stopCamera();
      } else {
        if (isActive) stopCamera();
        else startCamera();
      }
    };

    window.addEventListener("portfolio:toggle-camera", handleVoiceCamera);
    return () => window.removeEventListener("portfolio:toggle-camera", handleVoiceCamera);
  }, [isActive]);

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col items-end gap-2.5 pointer-events-none">
      {/* Nút Kích hoạt Camera Cử chỉ ở góc trên bên phải */}
      <motion.div
        className="pointer-events-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={isActive ? stopCamera : startCamera}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl cursor-pointer ${
            isActive
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-400 shadow-emerald-500/20 ring-2 ring-emerald-500/30"
              : "bg-zinc-950/80 hover:bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 text-zinc-400 hover:text-white"
          }`}
          aria-label="Toggle Hand Gesture Control"
        >
          {isActive ? (
            <Camera className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          ) : (
            <Hand className="w-3.5 h-3.5 text-zinc-400 group-hover:text-yellow-400 transition-colors" />
          )}

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider leading-none">
              {isActive ? "Cam Scroll: Bật" : "Cuộn 1-2 Ngón"}
            </span>
            <span className="text-[8px] font-mono text-zinc-500 leading-none mt-0.5">
              {isActive ? "1 ngón=Lên, 2 ngón=Xuống" : "Camera Cử chỉ"}
            </span>
          </div>
        </button>
      </motion.div>

      {/* Mini HUD Picture-in-Picture (PiP) Preview nằm ngay phía dưới nút Camera khi bật */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`pointer-events-auto p-3 rounded-2xl border shadow-2xl backdrop-blur-2xl space-y-2 text-zinc-100 max-w-[200px] transition-colors ${
              gesture === "FIST_BRAKE"
                ? "bg-red-950/95 border-red-500 shadow-red-500/30 ring-2 ring-red-500/40"
                : gesture === "ONE_FINGER_UP" || gesture === "TWO_FINGERS_DOWN"
                ? "bg-yellow-950/95 border-yellow-500 shadow-yellow-500/30 ring-1 ring-yellow-500/40"
                : "bg-zinc-950/95 border-zinc-800 shadow-yellow-500/10"
            }`}
          >
            {/* Header HUD */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-mono font-bold uppercase">
                <Eye className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>AI Vision HUD</span>
              </div>
              <button
                onClick={stopCamera}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Video Ẩn và Canvas Radar Visualizer */}
            <div className="relative w-[176px] h-[132px] rounded-xl overflow-hidden bg-black border border-zinc-800">
              <video
                ref={videoRef}
                className="hidden"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                width={176}
                height={132}
                className="w-full h-full object-cover -scale-x-100"
              />

              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-[9px] font-mono text-zinc-400 gap-1.5">
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  <span>Đang khởi động AI...</span>
                </div>
              )}
            </div>

            {/* Trạng thái Cử chỉ & Hướng Dẫn */}
            <div className="pt-1 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold">
                {gesture === "FIST_BRAKE" ? (
                  <span className="text-red-400 flex items-center gap-1 animate-pulse">
                    <OctagonAlert className="w-3.5 h-3.5" />
                    ĐÃ NẮM TAY (DỪNG)
                  </span>
                ) : gesture === "ONE_FINGER_UP" ? (
                  <span className="text-emerald-400 flex items-center gap-1 animate-pulse">
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                    1 Ngón: Đang Cuộn Lên
                  </span>
                ) : gesture === "TWO_FINGERS_DOWN" ? (
                  <span className="text-yellow-400 flex items-center gap-1 animate-pulse">
                    <ArrowDown className="w-3.5 h-3.5 text-yellow-400" />
                    2 Ngón: Đang Cuộn Xuống
                  </span>
                ) : gesture === "NEUTRAL" ? (
                  <span className="text-zinc-400">Đang Dừng (Neutral)</span>
                ) : (
                  <span className="text-zinc-500">Giơ 1 hoặc 2 ngón tay</span>
                )}
              </div>

              <p className="text-[8px] font-mono text-zinc-400 leading-tight">
                {gesture === "FIST_BRAKE"
                  ? "Nắm tay = Phanh dừng ngay lập tức"
                  : gesture === "ONE_FINGER_UP"
                  ? "Giơ 1 ngón = Cuộn Lên êm ru"
                  : gesture === "TWO_FINGERS_DOWN"
                  ? "Giơ 2 ngón = Cuộn Xuống thoải mái"
                  : "1 ngón = Lên • 2 ngón = Xuống • Nắm = Dừng"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
