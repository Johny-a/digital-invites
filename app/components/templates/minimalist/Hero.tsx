"use client";

type Props = {
  event: any;
};

export default function Hero({ event }: Props) {
  return (
    <section
    className="hero-image"
    style={{
        backgroundImage: `url(${event.bg_images?.hero || event.ending_photo})`,
    }}
>

      <div className="hero-content">

        <h1 className="hero-names">
          {event.hero_names}
        </h1>

        <p className="hero-date">
          {event.date_text}
        </p>

      </div>

    </section>
  );
}