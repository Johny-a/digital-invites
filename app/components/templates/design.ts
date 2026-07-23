export function getHeadingFont(event: any) {
    return (
        event.design?.typography?.heading ||
        "Cormorant Garamond"
    );
}

export function getBodyFont(event: any) {
    return (
        event.design?.typography?.body ||
        "Cormorant Garamond"
    );
}

export function getAccentFont(event: any) {
    return (
        event.design?.typography?.accent ||
        "Cormorant Garamond"
    );
}