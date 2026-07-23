"use client";

import "./gifts.css";

import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import GiftCard from "@/app/components/ui/GiftCard/GiftCard";

type Props = {
    event: any;
};

export default function Gifts({ event }: Props) {

    if (
        !event.gift_note &&
        (!event.gifts || event.gifts.length === 0)
    ) {
        return null;
    }

    return (

        <section className="gifts">

            <SectionTitle>
                Gifts
            </SectionTitle>

            {/* Decorative Divider */}

            <div className="gift-divider">

                <span></span>

                <div className="gift-divider-icon">
                    ✦
                </div>

                <span></span>

            </div>

            {event.gift_note && (

                <>
                    <p className="gifts-note">
                        {event.gift_note}
                    </p>

                    <div className="gift-heart">
                        ♥
                    </div>
                </>

            )}

            <div className="gift-list">

                {(event.gifts || []).map((gift: any, index: number) => (

                    <GiftCard
                        key={index}
                        logo={gift.logo}
                        label={gift.label}
                        value={gift.value}
                    />

                ))}

            </div>

        </section>

    );

}