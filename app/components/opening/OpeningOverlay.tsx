"use client";

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

    return (
        <div className={`opening-overlay ${opening ? "opening" : ""}`}>

            <div
                className="opening-background"
                style={{
                    backgroundImage: `url(${coverImage})`,
                }}
            />

            <div className="opening-content">

                {!opening ? (
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