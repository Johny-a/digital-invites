"use client";

import { useEffect, useState } from "react";

interface Props {
  mode?: "video" | "slideshow";
  video?: string;
  images?: string[];
  startSlideshow?: boolean;
}

export default function FixedBackground({
  mode = "slideshow",
  video,
  images = [],
  startSlideshow = true,
}: Props) {

  const [index, setIndex] = useState(0);

  useEffect(() => {

    if (mode !== "slideshow") return;

    if (!startSlideshow) return;

    if (images.length <= 1) return;

    const interval = setInterval(() => {

      setIndex((i) => (i + 1) % images.length);

    }, 3000);

    return () => clearInterval(interval);

  }, [mode, startSlideshow, images.join("|")]);

  return (

    <div className="fixed-bg">

      {mode === "video" && video ? (

        <video
          autoPlay
          muted
          loop
          playsInline
          className="bg-video"
        >
          <source src={video} />
        </video>

      ) : (

        images.map((src, i) => (

          <img
            key={src}
            src={src}
            alt=""
            className={`bg-image ${i === index ? "active" : ""}`}
          />

        ))

      )}

      <div className="bg-overlay" />

    </div>

  );

}