"use client";

import "./gift-card.css";
import Button from "@/app/components/ui/Button/Button";
import { useEffect, useState } from "react";

type Props = {
    logo?: string;
    label: string;
    value: string;
};

export default function GiftCard({
    logo,
    label,
    value,
}: Props) {

    const [copied, setCopied] = useState(false);

    async function copy() {

        try {

            await navigator.clipboard.writeText(value);

            setCopied(true);

        } catch {

            setCopied(true);

        }

    }

    useEffect(() => {

        if (!copied) return;

        const timer = setTimeout(() => {

            setCopied(false);

        }, 1800);

        return () => clearTimeout(timer);

    }, [copied]);

    return (

        <>
            <div className="gift-card">

                <div className="gift-left">

                    {logo ? (

                        <img
                            src={logo}
                            alt={label}
                            className="gift-logo"
                        />

                    ) : (

                        <span className="gift-icon">
                            🎁
                        </span>

                    )}

                </div>

                <div className="gift-right">

                    <h3 className="gift-title">

                        {label}

                    </h3>

                    <p className="gift-value">

                        {value}

                    </p>

                    <Button
                        variant="secondary"
                        onClick={copy}
                    >

                        <span className="gift-copy-icon">

                            ⧉

                        </span>

                        <span>

                            Copy Number

                        </span>

                    </Button>

                </div>

            </div>

            <div className={`gift-toast ${copied ? "show" : ""}`}>

                ✓ Number copied

            </div>
        </>

    );

}