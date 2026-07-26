import { useEffect, useRef, useState } from "react";
import "./opening-animation.css";

interface OpeningAnimationProps {
    image: string;
    initials: string;
    onStart?: () => void;
    onFinish: () => void;
    onReady?: () => void;
}
export default function OpeningAnimation({
    image,
    initials,
    onStart,
    onFinish,
    onReady,
}: OpeningAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [started, setStarted] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
const [videoReady, setVideoReady] = useState(false);
useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.load();
}, []);

  const start = async () => {
    if (started || !videoReady) return;

    setStarted(true);

    onStart?.();

    try {
        await videoRef.current?.play();
    } catch (e) {
        console.error(e);
    }
};

  return (
    <div className="opening" onClick={start}>

      <video
    ref={videoRef}
    className={`opening-video ${showPhoto ? "hide" : ""}`}
    muted
    playsInline
    preload="auto"
    onCanPlayThrough={() => {
    setVideoReady(true);
    onReady?.();
}}
    onEnded={() => {
        setShowPhoto(true);

        setTimeout(() => {
            onFinish();
        }, 5500);
    }}
>
        <source
          src="/envelope/envelope.mp4"
          type="video/mp4"
        />
      </video>

<div className={`wax-monogram ${started ? "hide" : ""}`}>
    {initials[0]}
    <span className="wax-heart">♥</span>
    {initials[1]}
</div>
      <div className={`opening-cover ${showPhoto ? "show" : ""}`}>
        <img src={image} alt="" />
      </div>
<div className={`tap-hint ${started ? "hide" : ""}`}>
  ✦ Click to Open ✦
</div>
    </div>
  );
}