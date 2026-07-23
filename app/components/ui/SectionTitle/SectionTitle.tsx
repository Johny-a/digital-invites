"use client";

import { ReactNode } from "react";
import "./section-title.css";

type Props = {
    children: ReactNode;
    subtitle?: ReactNode;
    align?: "left" | "center" | "right";
    className?: string;
};

export default function SectionTitle({
    children,
    subtitle,
    align = "center",
    className = "",
}: Props) {

    return (

        <header
            className={`section-title section-title--${align} ${className}`}
        >

            <h2 className="section-title__heading">

                {children}

            </h2>

            {subtitle && (

                <p className="section-title__subtitle">

                    {subtitle}

                </p>

            )}

        </header>

    );

}