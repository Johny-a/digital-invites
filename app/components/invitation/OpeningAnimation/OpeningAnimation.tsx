import { useRef, useState } from "react";
import "./opening-animation.css";

interface OpeningAnimationProps {
  image: string;
  onStart?: () => void;
  onFinish: () => void;
}
export default function OpeningAnimation({
  image,
  onStart,
  onFinish,
}: OpeningAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [started, setStarted] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
const [videoReady, setVideoReady] = useState(false);

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
    onCanPlayThrough={() => setVideoReady(true)}
    onEnded={() => {
        setShowPhoto(true);

        setTimeout(() => {
            onFinish();
        }, 3000);
    }}
>
        <source
          src="/envelope/envelope.mp4"
          type="video/mp4"
        />
      </video>

      <div className={`opening-cover ${showPhoto ? "show" : ""}`}>
        <img src={image} alt="" />
      </div>

    </div>
  );
}