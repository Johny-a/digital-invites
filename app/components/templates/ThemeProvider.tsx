"use client";

import { ReactNode } from "react";

type Props = {
    event: any;
    children: ReactNode;
};

export default function ThemeProvider({
    event,
    children,
}: Props) {

    const design = event.design || {};

    const style = {
        "--heading-font":
            design.typography?.heading || "Cormorant Garamond",

        "--body-font":
            design.typography?.body || "Cormorant Garamond",

        "--accent-font":
            design.typography?.accent || "Cormorant Garamond",

        "--accent-color":
            design.colors?.accent || "#C7A56A",

        "--paper-width":
            design.paper?.width === "wide"
                ? "520px"
                : design.paper?.width === "narrow"
                ? "340px"
                : "420px",

        "--overlay-opacity":
            design.colors?.overlay ?? 0.25,

    } as React.CSSProperties;

    return (

        <div
            style={style}
            className="theme-provider"
        >
            {children}
        </div>

    );
}