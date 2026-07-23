"use client";

import { useEffect, useState } from "react";
import "./opening.css";
import Envelope from "./Envelope";

type Props = {
    coverImage: string;
    names: string;
    tagline?: string;
    opening: boolean;
    onOpen: () => void;
};

export default function OpeningOverlay({
    coverImage,
    names,
    tagline,
    opening,
    onOpen,
}: Props) {

    const [coverReady, setCoverReady] = useState(false);

    useEffect(() => {

        if (!coverImage) {
            setCoverReady(true);
            return;
        }

        const img = new Image();

        img.src = coverImage;

        img.onload = () => setCoverReady(true);
        img.onerror = () => setCoverReady(true);

    }, [coverImage]);

    return (
        <div className={`opening-overlay ${opening ? "opening" : ""}`}>

            <div
                className="opening-background"
                style={{
                    backgroundImage: coverReady
                        ? `url(${coverImage})`
                        : "none",
                }}
            />

            <div className="opening-content">

                {!coverReady ? (

                    <div className="opening-loading">
                        Preparing...
                    </div>

                ) : !opening ? (

                    <>
                        <div className="opening-logo">

                            <h1>{names}</h1>

                            {tagline && (
                                <p>{tagline}</p>
                            )}

                        </div>

                        <button
                            className="opening-button"
                            onClick={onOpen}
                        >
                            Open Invitation
                        </button>
                    </>

                ) : (

                    <Envelope />

                )}

            </div>

        </div>
    );
}