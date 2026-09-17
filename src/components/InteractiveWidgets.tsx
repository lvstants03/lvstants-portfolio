"use client";

import dynamic from "next/dynamic";

const AmbientSoundPlayer = dynamic(() => import("@/components/AmbientSoundPlayer"), {
  ssr: false,
});

const VoiceAIAssistant = dynamic(() => import("@/components/VoiceAIAssistant"), {
  ssr: false,
});

const HandGestureScroll = dynamic(() => import("@/components/HandGestureScroll"), {
  ssr: false,
});

export default function InteractiveWidgets() {
  return (
    <>
      <AmbientSoundPlayer />
      <HandGestureScroll />
      <VoiceAIAssistant />
    </>
  );
}
