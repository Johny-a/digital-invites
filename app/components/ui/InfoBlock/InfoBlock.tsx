"use client";

import { ReactNode } from "react";
import "./info-block.css";

type Props = {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    className?: string;
};

export default function InfoBlock({
    icon,
    title,
    description,
    children,
    className = "",
}: Props) {

    return (

        <div className={`info-block ${className}`}>

            {icon && (

                <div className="info-block__icon">

                    {icon}

                </div>

            )}

            <h3 className="info-block__title">

                {title}

            </h3>

            {description && (

    <div className="info-block__subtitle">

        {description}

    </div>

)}

            {children && (

                <div className="info-block__actions">

                    {children}

                </div>

            )}

        </div>

    );

}