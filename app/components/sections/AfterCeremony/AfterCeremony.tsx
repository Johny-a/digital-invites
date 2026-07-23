"use client";

import "./after-ceremony.css";

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

export default function AfterCeremony({
    title = "After Ceremony",
    place,
    time,
    note,
    mapUrl,
}: Props) {

    return (

        <section className="after-ceremony">

            <SectionTitle>

                {title}

            </SectionTitle>
{/* Decorative Divider */}

<div className="gift-divider">
    <span></span>
    <div className="gift-divider-icon">✦</div>
    <span></span>
</div>

            <InfoBlock

                icon={

                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M12 22s7-6.2 7-13a7 7 0 10-14 0c0 6.8 7 13 7 13z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        />
                        <circle
                            cx="12"
                            cy="9"
                            r="2.5"
                            fill="currentColor"
                        />
                    </svg>

                }

                title={place ?? ""}

                description={
                    <>
                        {time && <div>{time}</div>}

                        {note && <div>{note}</div>}
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

            </InfoBlock>

        </section>

    );

}