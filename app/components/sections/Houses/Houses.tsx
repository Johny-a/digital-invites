"use client";

import "./houses.css";

import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import InfoBlock from "@/app/components/ui/InfoBlock/InfoBlock";
import Button from "@/app/components/ui/Button/Button";

type Props = {
    event: any;
};

export default function Houses({
    event,
}: Props) {

    return (

        <section className="houses">

            <SectionTitle>

                {event.houses_title || "Wedding Houses"}

            </SectionTitle>
<div className="section-divider">
    <span></span>
    <div className="section-divider-icon">✦</div>
    <span></span>
</div>

            {/* Groom */}

            {(event.groom_title || event.groom_place) && (

                <div className="house-block">

                    <InfoBlock

                        title={event.groom_title}

                        description={
                            <>
                                {event.groom_place && (
                                    <div>{event.groom_place}</div>
                                )}

                                {event.groom_note && (
                                    <div>{event.groom_note}</div>
                                )}
                            </>
                        }

                    >

                        {event.groom_map && (

                            <Button
                                variant="secondary"
                                onClick={() =>
                                    window.open(
                                        event.groom_map,
                                        "_blank"
                                    )
                                }
                            >
                                View Map
                            </Button>

                        )}

                    </InfoBlock>

                </div>

            )}

            {/* Bride */}

            {(event.bride_title || event.bride_place) && (

                <div className="house-block">

                    <InfoBlock

                        title={event.bride_title}

                        description={
                            <>
                                {event.bride_place && (
                                    <div>{event.bride_place}</div>
                                )}

                                {event.bride_note && (
                                    <div>{event.bride_note}</div>
                                )}
                            </>
                        }

                    >

                        {event.bride_map && (

                            <Button
                                variant="secondary"
                                onClick={() =>
                                    window.open(
                                        event.bride_map,
                                        "_blank"
                                    )
                                }
                            >
                                View Map
                            </Button>

                        )}

                    </InfoBlock>

                </div>

            )}

            {event.houses_footer && (

                <p className="houses-footer">

                    {event.houses_footer}

                </p>

            )}

        </section>

    );

}