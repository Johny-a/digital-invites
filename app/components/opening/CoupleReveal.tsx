"use client";

type Props = {
    image: string;
    visible: boolean;
};

export default function CoupleReveal({
    image,
    visible,
}: Props) {
    return (
        <div
            className={`couple-reveal ${
                visible ? "show" : ""
            }`}
        >
            {/* Background Image */}
            <img
                src={image}
                alt=""
                draggable={false}
                className="couple-image"
            />

            {/* Dark cinematic overlay */}
            <div className="couple-overlay" />

            {/* Soft vignette */}
            <div className="couple-vignette" />

            {/* Luxury light */}
            <div className="couple-light" />
        </div>
    );
}