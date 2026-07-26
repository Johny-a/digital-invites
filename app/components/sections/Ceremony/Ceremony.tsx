"use client";

import "./ceremony.css";

import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import InfoBlock from "@/app/components/ui/InfoBlock/InfoBlock";
import Button from "@/app/components/ui/Button/Button";
type Props = {
    title?: string;
    place?: string;
    time?: string;
    note?: string;
    mapUrl?: string;
};
export default function Ceremony({
    title = "Wedding Ceremony",
    place,
    time,
    note,
    mapUrl,
}: Props){

    return(

        <section className="ceremony">

            <SectionTitle>

                {title}

            </SectionTitle>
<div className="section-divider">
    <span></span>
    <div className="section-divider-icon">✦</div>
    <span></span>
</div>

 <InfoBlock

    icon={
    <img
        src="/icons/church-elegant.png"
        className="ceremony-icon"
        alt="Church"
    />
}

    title=""

description={
<>
    {note && (
        <div className="ceremony-note">
            {note}
        </div>
    )}

    {place && (
    <div className="ceremony-place-wrap">

        <div className="ceremony-place">
            {place}
        </div>

        <div className="ceremony-location-icon">
<svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="currentColor"
>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
</svg>
        </div>

    </div>
)}

    {time && (
        <div className="ceremony-time">
            {time}
        </div>
    )}
</>
}

>

    {mapUrl && (

        <Button
            variant="secondary"
            onClick={() => window.open(mapUrl, "_blank")}
        >
            View Map
        </Button>

    )}
<div className="section-divider">
    <img src="/ornaments/divider.png" alt="" />
</div>
<div className="celebration-bottom-note">
    يلي الإكليل حفل عشاء في
    <br />
    <strong className="restaurant-name">
        Piscine Cachada
    </strong>
</div>

</InfoBlock>

        </section>

    );

}