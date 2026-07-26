"use client";

import { useState } from "react";

type Props = {
    onComplete: () => void;
};

export default function Envelope({ onComplete }: Props) {

    const [opening, setOpening] = useState(false);

    const open = () => {

        if (opening) return;

        setOpening(true);

        // Envelope animation
        setTimeout(() => {
            onComplete();
        }, 3400);
    };

    return (

        <div className={`luxury-envelope ${opening ? "opening" : ""}`}>

            {/* Back of envelope */}
            <img
                src="/envelope/back.png"
                alt=""
                draggable={false}
                className="env-back"
            />

            {/* Letter */}
            <div className="letter-window">
                <img
                    src="/envelope/letter.png"
                    alt=""
                    draggable={false}
                    className="env-letter"
                />
            </div>

            {/* Front */}
            <img
                src="/envelope/front.png"
                alt=""
                draggable={false}
                className="env-front"
            />

            {/* Flap */}
            <img
                src="/envelope/flap.png"
                alt=""
                draggable={false}
                className="env-flap"
            />

            {/* Wax Seal */}
<button
    className="seal-button"
    onClick={open}
    aria-label="Open invitation"
>
    <img
        src="/envelope/seal.png"
        alt=""
        draggable={false}
        className="env-seal"
    />

    <span className="seal-monogram">
        T ❤ C
    </span>

</button>

        </div>

    );

}