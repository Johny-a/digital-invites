import { DEFAULT_DESIGN } from "./defaults";

export function buildTheme(design: any = {}) {
const preset =
    design.preset ??
    DEFAULT_DESIGN.preset;

    const typography = {
        ...DEFAULT_DESIGN.typography,
        ...design.typography,
    };

    const colors = {
        ...DEFAULT_DESIGN.colors,
        ...design.colors,
    };

    const paper = {
        ...DEFAULT_DESIGN.paper,
        ...design.paper,
    };

    const countdown = {
        ...DEFAULT_DESIGN.countdown,
        ...design.countdown,
    };

    const opening = {
        ...DEFAULT_DESIGN.opening,
        ...design.opening,
    };

    const animations = {
        ...DEFAULT_DESIGN.animations,
        ...design.animations,
    };

    return {

        cssVariables: {

            /* Typography */

            "--heading-font": typography.heading,

            "--body-font": typography.body,

            "--accent-font": typography.accent,

            /* Colors */

            "--accent-color": colors.accent,

            "--overlay-opacity": String(colors.overlay),

            "--paper-bg": colors.paper,

            "--text-color": colors.text,

            "--text-light": colors.textLight,

            "--border-color": colors.border,

            /* Paper */

            "--paper-width":
                paper.width === "wide"
                    ? "520px"
                    : paper.width === "narrow"
                    ? "340px"
                    : "420px",

        } as React.CSSProperties,

        paperTexture: paper.texture,

        countdownStyle: countdown.style,

        openingStyle: opening.style,

        animationStyle: animations.style,

    };

}