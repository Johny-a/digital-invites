import { useEffect, useMemo, useRef, useState } from "react";
import "./opening-animation.css";
import OpeningParticles from "./OpeningParticles";

interface OpeningAnimationProps {
  /** The invitation artwork that slides out of the envelope. */
  image: string;
  /** Text pressed into the wax seal — the hero's name / initials. */
  initials: string;
  /** Small line under the initials on the seal (year, monogram…). */
  sealCaption?: string;
  /** Names shown above the envelope before it is opened. */
  names?: string;
  eyebrow?: string;
  hint?: string;
  onFinish: () => void;
}

/* ---------------------------------------------------------
   Timeline (ms, measured from the click on the wax seal)
--------------------------------------------------------- */
const FLAP_OPEN_AT = 380; // flap starts folding back
const SEAL_GONE_AT = 760; // seal has visually shattered
const CARD_RISE_AT = 1150; // card starts climbing out
const CARD_RISE_DURATION = 1700; // matches .card--rise
const CARD_PRESENT_DURATION = 900; // matches .card--present
const HOLD_DURATION = 3000; // <-- fully shown for a full 3 seconds
const EXIT_DURATION = 1500; // matches .card--fly
const FADE_BUFFER = 350;

const CARD_PRESENT_AT = CARD_RISE_AT + CARD_RISE_DURATION;
const CARD_FULLY_SHOWN_AT = CARD_PRESENT_AT + CARD_PRESENT_DURATION;
const EXIT_AT = CARD_FULLY_SHOWN_AT + HOLD_DURATION;
const FINISHED_AT =
    EXIT_AT +
    3000 +
    EXIT_DURATION +
    FADE_BUFFER;

type CardPhase = "rest" | "rise" | "present" | "fly";

export default function OpeningAnimation({
  image,
  initials,
  sealCaption = "MMXXVI",
  names = "",
  eyebrow = "You are invited",
  hint = "Tap the seal to open",
  onFinish,
}: OpeningAnimationProps) {
  const timers = useRef<number[]>([]);

  const [opened, setOpened] = useState(false);
  const [sealGone, setSealGone] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardPhase, setCardPhase] = useState<CardPhase>("rest");
  const [zoom, setZoom] = useState(false);
  const [cover, setCover] = useState(false);
  const [finished, setFinished] = useState(false);

  const shards = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 60 + Math.random() * 90;
        return {
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist * 0.75 - 20}px`,
          rot: `${(Math.random() - 0.5) * 540}deg`,
          size: `${5 + Math.random() * 7}px`,
          delay: `${Math.random() * 90}ms`,
        };
      }),
    [],
  );

  const queue = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const start = () => {
    if (opened) return; // ignore repeat clicks
    setOpened(true);

    queue(() => setFlapOpen(true), FLAP_OPEN_AT);
    queue(() => setSealGone(true), SEAL_GONE_AT);

    // the card climbs out of the envelope…
    queue(() => setCardPhase("rise"), CARD_RISE_AT);
    // …settles + scales up so it is completely, unmistakably visible…
    queue(() => setCardPhase("present"), CARD_PRESENT_AT);

    // …then it simply SITS there for HOLD_DURATION (3s). Nothing happens.

    // only after the hold do we leave for the invitation itself
queue(() => {
    setCover(true);
}, EXIT_AT);

queue(() => {
    setZoom(true);
    setCardPhase("fly");
}, EXIT_AT + 3000);

    queue(() => {
      setFinished(true);
      onFinish();
    }, FINISHED_AT);
  };

  if (finished) {
    return <div className="opening opening-fade" />;
  }

  const titleHidden = cardPhase !== "rest";

  return (
    <div className="opening">
      <OpeningParticles />

      {names && (
    <div className={`opening-title ${titleHidden ? "hide" : ""}`}>
        <div className="save-date">SAVE THE DATE</div>

        <div className="names">
            {names}
        </div>

        <div className="subtitle">
            Together with their families
        </div>
    </div>
)}

      <div className={`opening-cover ${cover ? "show" : ""}`}>
        <img src={image} alt="" aria-hidden="true" />
      </div>

      <div className={`opening-stage ${zoom ? "zoom" : ""}`}>
        <div className="envelope">
          <div className="envelope-glow" />

          {/* hidden behind .envelope-back until it rises out */}
          <div className={`card ${cardPhase !== "rest" ? `card--${cardPhase}` : ""}`}>
            <img src={image} alt="Wedding invitation" />
          </div>

          <div className="envelope-back" />
          <div className="envelope-pocket" />
          <div className="envelope-lip" />

          <div className={`flap ${flapOpen ? "open" : ""}`} />

          {!sealGone && (
            <button
              type="button"
              className={`seal ${opened ? "break" : ""}`}
              onClick={start}
              aria-label="Open the invitation"
            >
              <span className="seal-initials">{initials}</span>
              <span className="seal-rule" />
              <span className="seal-year">{sealCaption}</span>
            </button>
          )}

          {opened &&
            !sealGone &&
            shards.map((s, i) => (
              <span
                key={i}
                className="shard"
                style={
                  {
                    width: s.size,
                    height: s.size,
                    animationDelay: s.delay,
                    "--dx": s.dx,
                    "--dy": s.dy,
                    "--rot": s.rot,
                  } as React.CSSProperties
                }
              />
            ))}
        </div>
      </div>

      <div className={`opening-hint ${opened ? "hide" : ""}`}>{hint}</div>
    </div>
  );
}
