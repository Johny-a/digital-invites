"use client";

import { useRef, useState } from "react";

export default function EnterWithMusic({
  musicUrl,
  children,
}: {
  musicUrl?: string;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setStarted(true);
  };

  return (
    <>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

      {!started && musicUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <button
            onClick={startMusic}
            className="bg-white text-black px-6 py-3 rounded-lg text-lg font-semibold"
          >
            🔊 Tap to Enter
          </button>
        </div>
      )}

      {children}
    </>
  );
}
