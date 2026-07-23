"use client";

import "./ending.css";

type Props = {
    event: any;
};

export default function Ending({ event }: Props) {

    if (!event.ending_photo) return null;

    const boardText =
        event.ending_message?.trim() || "♡ Happily ever after ♡";

    return (
        <section className="ending">

            <div className="ending-top">
                <img src="/paper/top.svg" alt="" />
            </div>

            <img
                src={event.ending_photo}
                className="ending-photo"
                alt=""
            />

            <div className="ending-bottom">

                <p className="ending-message">
                    {boardText}
                </p>

                <div className="ending-divider"></div>

                <img
                    src="/logo-black.png"
                    className="ending-logo"
                    alt=""
                />

            </div>

        </section>
    );
}