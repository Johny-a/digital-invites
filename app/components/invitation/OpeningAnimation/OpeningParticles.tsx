import { useMemo } from "react";

type Particle = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
};

/**
 * Slow drifting gold embers behind the envelope.
 * Values are generated once (useMemo) so React re-renders
 * never restart the individual particle animations.
 */
export default function OpeningParticles({ count = 42 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 9,
        duration: 9 + Math.random() * 8,
        size: 1.5 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 120,
        opacity: 0.25 + Math.random() * 0.55,
      })),
    [count],
  );

  return (
    <div className="opening-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
              "--peak": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
