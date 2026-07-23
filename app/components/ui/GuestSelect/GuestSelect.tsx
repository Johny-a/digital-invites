"use client";

import { useEffect, useRef, useState } from "react";
import "./guest-select.css";

type Props = {
    value: number;
    max: number;
    onChange: (value: number) => void;
};

export default function GuestSelect({
    value,
    max,
    onChange,
}: Props) {

    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        function close(e: MouseEvent) {

            if (
                ref.current &&
                !ref.current.contains(e.target as Node)
            ) {

                setOpen(false);

            }

        }

        document.addEventListener("mousedown", close);

        return () =>
            document.removeEventListener("mousedown", close);

    }, []);

    return (

        <div
            className="guest-select"
            ref={ref}
        >

            <button
                type="button"
                className="guest-select-trigger"
                onClick={() => setOpen(v => !v)}
            >

               <span className={value ? "" : "guest-placeholder"}>

    {value
        ? `${value} ${value === 1 ? "Guest" : "Guests"}`
        : "Select number of guests"}

</span>
                <span className={`guest-arrow ${open ? "open" : ""}`}>

                    ▾

                </span>

            </button>

            {open && (

                <div className="guest-dropdown">

                    {Array.from(
                        { length: max },
                        (_, i) => i + 1
                    ).map(number => (

                        <button
                            key={number}
                            type="button"
                            className={`guest-item ${
                                value === number
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => {

                                onChange(number);

                                setOpen(false);

                            }}
                        >

                            {number} {number === 1 ? "Guest" : "Guests"}

                        </button>

                    ))}

                </div>

            )}

        </div>

    );

}