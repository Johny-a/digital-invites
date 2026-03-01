"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (audioRef.current && !started) {
      audioRef.current.muted = true; // start muted (browser rule)
      audioRef.current
        .play()
        .then(() => {
          setStarted(true);
        })
        .catch(() => {
          // Autoplay blocked until user interacts (normal)
        });
    }
  }, [started]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMuted = !muted;
    audioRef.current.muted = newMuted;
    setMuted(newMuted);

    // If user unmutes and it wasn't playing, force play
    if (!newMuted) {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio ref={audioRef} src={url} loop />

      <button
        onClick={toggleMute}
        className="bg-white text-black px-4 py-2 rounded shadow"
      >
        {muted ? "🔇 Unmute" : "🔊 Mute"}
      </button>
    </div>
  );
}
