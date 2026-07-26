THIS_IS_A_TEST
"use client";

import { useEffect, useRef, useState } from "react";
import "./opening-animation.css";
import OpeningParticles from "./OpeningParticles";

interface OpeningAnimationProps {
  image: string;
  onFinish: () => void;
}

export default function OpeningAnimation({
  image,
  onFinish,
}: OpeningAnimationProps) {

  const timers = useRef<number[]>([]);

  const [opened, setOpened] = useState(false);
  const [sealGone, setSealGone] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardLift, setCardLift] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [cover, setCover] = useState(false);
  const [finished, setFinished] = useState(false);

  const queue = (cb: () => void, delay: number) => {
    const id = window.setTimeout(cb, delay);
    timers.current.push(id);
  };

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const start = () => {
    setOpened(true);
    setSealGone(true);

    queue(() => setFlapOpen(true), 300);

    queue(() => setCardLift(true), 800);

    queue(() => setZoom(true), 1500);

    queue(() => setCover(true), 1900);

    queue(() => {

        setFinished(true);

        onFinish();

    }, 2600);

};

  if (finished) {
    return <div className="opening opening-fade" />;
}

return (
    <div className="opening">

        <OpeningParticles />

        <div className={`opening-cover ${cover ? "show" : ""}`}>
            <img src={image} alt="" />
        </div>

        <div className={`opening-stage ${zoom ? "zoom" : ""}`}>

            <div className="envelope">

                <div className={`card ${cardLift ? "lift" : ""}`}>
                    <img src={image} alt="" />
                </div>

                <div className="envelope-back" />

                <div className="envelope-pocket" />

                <div className={`flap ${flapOpen ? "open" : ""}`} />

                {!sealGone && (
                    <button
                        className={`seal ${opened ? "break" : ""}`}
                        onClick={start}
                    >
                        ❤
                    </button>
                )}

            </div>

        </div>

    </div>
);
}