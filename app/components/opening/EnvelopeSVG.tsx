"use client";

type Props = {
    opening:boolean;
    image:string;
    initials:string;
    onOpen:()=>void;
};

export default function EnvelopeSVG({
    opening,
    image,
    initials,
    onOpen,
}:Props)
    return (
<div
    className={`luxury-envelope ${
        opening ? "opening" : ""
    }`}
>

    <div className="envelope-camera">
            <div className="env-shadow" />

 className="env-inner-light" />

            {/* LETTER */}

            <div className="env-letter">

                  className={`invite-card ${

            {/* SVG ENVELOPE */}

            <svg
                className="env-svg"
                viewBox="0 0 600 420"
                preserveAspectRatio="none"
            >
                <defs>

                    <linearGradient
                        id="paper"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#fffdf8" />
                        <stop offset="100%" stopColor="#efe2cf" />
                    </linearGradient>

                    <linearGradient
                        id="paper2"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#faf4ea" />
                        <stop offset="100%" stopColor="#e8dac5" />
                    </linearGradient>

                </defs>

                {/* Back */}

                <rect
                    className="env-back"
                    x="70"
                    y="110"
                    rx="12"
                    width="460"
                    height="240"
                    fill="url(#paper)"
                />

                {/* Left Fold */}

                <path
                    className="env-left"
                    d="
                    M70 350
                    L70 110
                    L300 235
                    Z
                "
                    fill="url(#paper2)"
                />

                {/* Right Fold */}

                <path
                    className="env-right"
                    d="
                    M530 350
                    L530 110
                    L300 235
                    Z
                "
                    fill="url(#paper2)"
                />

                {/* Bottom Fold */}

                <path
                    className="env-bottom"
                    d="
                    M70 350
                    L300 190
                    L530 350
                    Z
                "
                    fill="#f7efe2"
                />

                {/* Flap */}

                <g className="env-flap">

                    <path
                        d="
                        M70 110
                        L530 110
                        Q300 265 70 110
                        Z
                    "
                        fill="#fffaf4"
                    />

                </g>

            </svg>

            {/* WAX */}

            <button
    className={`env-seal ${
        opening ? "seal-open" : ""
    }`}
    onClick={onOpen}
    aria-label="Open Invitation"
>

    <span>{initials}</span>

    <span className="seal-crack" />

</button>
        </div>
    );
}