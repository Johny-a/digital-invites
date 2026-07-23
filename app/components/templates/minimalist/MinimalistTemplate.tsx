"use client";

import "./minimalist.css";

import FixedBackground from "./FixedBackground";
import Paper from "@/app/components/ui/Paper/Paper";
import Spacer from "./Spacer";

import Invitation from "@/app/components/sections/Invitation/Invitation";
import Ceremony from "@/app/components/sections/Ceremony/Ceremony";
import Celebration from "@/app/components/sections/Celebration/Celebration";
import Houses from "@/app/components/sections/Houses/Houses";
import AfterCeremony from "@/app/components/sections/AfterCeremony/AfterCeremony";
import Gifts from "@/app/components/sections/Gifts/Gifts";
import RSVP from "@/app/components/sections/RSVP/RSVP";
import Ending from "@/app/components/sections/Ending/Ending";
import React, { useMemo } from "react";

export default function MinimalistTemplate({

    safeEvent,
    timeLeft,

    mainName,
    setMainName,

    maxInvites,

    guestCount,
    setGuestCount,

    attending,
    setAttending,

    note,
    setNote,

    submitRSVP,

    sending,
    sent,
    error,

audioRef

}: any) {

const bgImages = useMemo(
    () => Object.values(safeEvent.bg_images || {}),
    [safeEvent.bg_images]
);
return (

    <div className="minimalist">


            <FixedBackground
    mode={safeEvent.bg_mode}
    video={safeEvent.bg_video}
    images={bgImages}
/>
<Spacer h={90} />

<div className="scroll-indicator">
    <div className="scroll-line"></div>

    <div className="scroll-text">
        Scroll
    </div>

    <div className="scroll-arrow">
        ↓
    </div>
</div>

{/* =========================
    INVITATION
========================== */}

<Paper>
        <Spacer h={5} />
                <Invitation
                    event={safeEvent}
                    timeLeft={timeLeft}
                />

</Paper>

{safeEvent.houses_title && (
    <>
        <Spacer h={55} />

        <Paper>

            <Houses event={safeEvent} />

        </Paper>
    </>
)}

<Spacer h={60} />



            {/* =========================
                CEREMONY
            ========================== */}

            <Paper>

<Ceremony
    place={safeEvent.ceremony_place}
    time={safeEvent.ceremony_time}
    note={safeEvent.ceremony_note}
    mapUrl={safeEvent.ceremony_map}
/>

            </Paper>

           

{/* =========================
    AFTER CEREMONY
========================= */}

{safeEvent.after_place && (
    <>
        <Spacer h={60} />

        <Paper>

            <AfterCeremony
                place={safeEvent.after_place}
                time={safeEvent.after_time}
                note={safeEvent.after_note}
                mapUrl={safeEvent.after_map}
            />

        </Paper>
    </>
)}

<Spacer h={60} />


            {/* =========================
                CELEBRATION
            ========================== */}

<Paper>

    <Celebration
    venue={safeEvent.celebration_place}
    time={safeEvent.celebration_time}
    address={safeEvent.celebration_note_bottom}
    mapUrl={safeEvent.celebration_map}
/>

</Paper>

<Spacer h={60} />

<Paper>

    <Gifts
        event={safeEvent}
    />

</Paper>
<Spacer h={60} />

<Paper>

<RSVP

    maxInvites={maxInvites}

    mainName={mainName}
    setMainName={setMainName}

    guestCount={guestCount}
    setGuestCount={setGuestCount}

    attending={attending}
    setAttending={setAttending}

    note={note}
    setNote={setNote}

    submitRSVP={submitRSVP}

    sending={sending}
    sent={sent}
    error={error}

/>

</Paper>



<Ending
    event={safeEvent}
/>

<button
    className="music-toggle"
    onClick={() => {
        if (!audioRef.current) return;

        if (!audioRef.current) return;

if (audioRef.current.paused) {

    audioRef.current.play();

} else {

    audioRef.current.pause();

}
    }}
>
    🎵
</button>
        </div>

    );

}