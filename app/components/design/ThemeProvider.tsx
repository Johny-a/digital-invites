"use client";

import { ReactNode } from "react";
import { buildTheme } from "./buildTheme";

type Props = {
    event: any;
    children: ReactNode;
};

export default function ThemeProvider({
    event,
    children,
}: Props) {

    const theme = buildTheme(event.design);

    return (

        <div
            className="theme-provider"
            style={theme.cssVariables}
            data-paper-texture={theme.paperTexture}
        >
            {children}
        </div>

    );

}