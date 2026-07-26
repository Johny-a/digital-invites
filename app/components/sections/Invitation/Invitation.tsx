"use client";

import Countdown from "@/app/components/ui/Countdown/Countdown";

type Props = {
  event: any;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
};

export default function Invitation({
  event,
  timeLeft,
}: Props) {

  const heroNames = (event.hero_names || "").trim();

// First letter of the first name
const firstInitial = heroNames.charAt(0).toUpperCase();

// First letter of the last word
const secondInitial =
  heroNames
    .split(/\s+/)
    .filter((word: string) => word !== "&" && word.toLowerCase() !== "and")
    .pop()
    ?.charAt(0)
    .toUpperCase() || "";

  return (

    <section className="invitation-section">

      {/* HERO SPACE */}
      <div className="hero-space" />

      <div className="invite-heart">
        <span>{heroNames.trim().charAt(0).toUpperCase()}</span>
        <span>♥</span>
        <span>{secondInitial}</span>
      </div>

      <div className="section-divider">
        <span></span>
        <div className="section-divider-icon">✦</div>
        <span></span>
      </div>

      {event.invitation_quote && (
        <p className="invite-quote">
          {event.invitation_quote}
        </p>
      )}

      <div className="invite-parents">

        {event.invitation_parents_right && (
  <p className="invite-parent-name">
    <span className="invite-parent-label">
      {event.parents_label_right_en || "Mr. & Mrs."}
    </span>

    <span className="invite-parent-person">
      {event.invitation_parents_right}
    </span>
  </p>
)}

{event.invitation_parents_left && (
  <p className="invite-parent-name">
    <span className="invite-parent-label">
      {event.parents_label_left_en || "Mr. & Mrs."}
    </span>

    <span className="invite-parent-person">
      {event.invitation_parents_left}
    </span>
  </p>
)}

      </div>

      {event.invitation_request_line && (
        <p className="invite-request">
          {event.invitation_request_line}
        </p>
      )}

      <h2 className="invite-couple">
        {heroNames
          .split("&")
          .map((part: string) => part.trim())
          .map((part: string, index: number, arr: string[]) => (
            <div key={index}>
              {part}
              {index < arr.length - 1 && (
                <div className="invite-and">&</div>
              )}
            </div>
          ))}
      </h2>

      <p className="invite-date">
        {event.date_text}
      </p>

      <Countdown timeLeft={timeLeft} />

    </section>

  );

}