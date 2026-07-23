"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    fullWidth?: boolean;
};

export default function Button({
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    ...props
}: Props) {

    return (

        <button
            {...props}
            className={`ui-button ui-button--${variant} ${fullWidth ? "ui-button--full" : ""} ${className}`}
        >

            {children}

        </button>

    );

}