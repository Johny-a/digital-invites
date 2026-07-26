"use client";

import { useEffect, useState } from "react";
import "./opening.css";

import EnvelopeSVG from "./EnvelopeSVG";
import CoupleReveal from "./CoupleReveal";

type Props = {
    coverImage: string;
    names: string;
    tagline?: string;
    opening: boolean;
    onOpen: () => void;
};

export default function OpeningOverlay({
    coverImage,
    opening,
    onOpen,
}: Props) {

    const [coverReady, setCoverReady] = useState(false);
    const [phase, setPhase] = useState<
        "loading" | "envelope" | "photo"
    >("loading");

    useEffect(() => {

        if (!coverImage) {

            setCoverReady(true);
            setPhase("envelope");

            return;
        }

        const img = new Image();

        img.src = coverImage;

        img.onload = () => {

    setCoverReady(true);

    setTimeout(() => {

        setPhase("envelope");

    }, 300);



        };

        img.onerror = () => {

            setCoverReady(true);

            setPhase("envelope");

        };

    }, [coverImage]);

    const handleEnvelopeFinished = () => {

    /*
        Envelope finished opening.

        Show the background immediately.
    */

    setPhase("photo");

    /*
        Keep the background visible
        before entering the invitation.
    */

    setTimeout(() => {

    onOpen();

}, 5000);

};

const initials = names
    .split("&")
    .map(n => n.trim()[0] ?? "")
    .join(" ❤ ");

    return (

        <div
            className={`opening-overlay ${
                opening ? "opening" : ""
            }`}
        >

            {!coverReady && (

                <div className="opening-loading">

                    Preparing...

                </div>

            )}

            {phase === "envelope" && (

                <EnvelopeSVG
    opening={phase === "photo"}
    onOpen={handleEnvelopeFinished}
    image={coverImage}
    initials={initials}
/>

            )}

            <div
    className={`opening-background ${
        phase === "photo" ? "show" : ""
    }`}
>

    <CoupleReveal
        image={coverImage}
        visible={true}
    />

</div>

        </div>

    );

}