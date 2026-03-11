"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EventData = {
  id?: string;

  ending_photo: string;

  bg_mode?: "video" | "slideshow";
  bg_images?: string[];
  bg_video?: string;
  music_url?: string;

  title?: string;
  subtitle?: string;

  date_text?: string;
  time_text?: string;
  location_text?: string;

  hero_names: string;
  hero_tagline: string;
  hero_headline: string;

  // ✅ ADD THESE
  invitation_quote?: string;
  invitation_parents_left?: string;
  invitation_parents_right?: string;
  invitation_request_line?: string;

  ceremony_place?: string;
  ceremony_time?: string;
  ceremony_map?: string;

  celebration_place?: string;
  celebration_time?: string;
  celebration_map?: string;

  video_url?: string;

  gallery?: string[];

  gifts?: { label: string; value: string }[];

  ending_message?: string;

  template_id?: string;

  text_positions?: {
    heroTitle?: { x: number; y: number };
    heroSubtitle?: { x: number; y: number };
    invitationBlock?: { x: number; y: number };
  };
};
const SLIDES = [
  "hero",
  "invitation",
  "ceremony",
  "celebration",
  "gifts",    
  "rsvp",
  "photos",
  "ending",
] as const;



const TEMPLATES: Record<string, { title: string; subtitle: string; overlay: string }> = {
  classic: {
    title: "font-serif text-yellow-200",
    subtitle: "text-white/90",
    overlay: "bg-black/50",
  },
  modern: {
    title: "font-sans text-white",
    subtitle: "text-white/80",
    overlay: "bg-black/40",
  },
  minimal: {
    title: "font-light text-white",
    subtitle: "text-white/70",
    overlay: "bg-black/30",
  },
};

export default function InvitationPlayer({
  event,
  templateId = "classic",
  editorMode = false,
  forcedPage,
}: {
  event: EventData;
  templateId?: string;
  editorMode?: boolean;
  forcedPage?: number;
}) {
const safeEvent: EventData = {
  ...event,
  gallery: Array.isArray(event?.gallery) ? event.gallery : [],
  bg_images: Array.isArray(event?.bg_images) ? event.bg_images : [],
  gifts: Array.isArray(event?.gifts) ? event.gifts : [],
  text_positions: event?.text_positions || {},
};
const gallery = safeEvent.gallery ?? [];
const bgImages = safeEvent.bg_images ?? [];


const [mainName, setMainName] = useState("");
const [attending, setAttending] = useState<boolean | null>(null);
const [note, setNote] = useState("");
const [sending, setSending] = useState(false);
const [sent, setSent] = useState(false);
const [error, setError] = useState<string | null>(null);
const [guestCount, setGuestCount] = useState(1);


const [bgIndex, setBgIndex] = useState(0);


const template = TEMPLATES[templateId] || TEMPLATES.classic;

const [page, setPage] = useState(0);
const [started, setStarted] = useState(editorMode);
const [muted, setMuted] = useState(editorMode ? true : false);
const [fade, setFade] = useState(false);

// Photos slider state
const [photoIndex, setPhotoIndex] = useState(0);
const [photoOffset, setPhotoOffset] = useState(0);
const [isDragging, setIsDragging] = useState(false);
const touchStartX = useRef<number | null>(null);


  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

useEffect(() => {
  if (safeEvent.bg_mode !== "slideshow") return;
  if (!safeEvent.bg_images || safeEvent.bg_images.length <= 1) return;

  const interval = setInterval(() => {
    setBgIndex((i) =>
      i === (safeEvent.bg_images?.length ?? 0) - 1 ? 0 : i + 1
    );
  }, 4000); // 4 seconds (change to 3000–5000 if you want)

  return () => clearInterval(interval);
}, [safeEvent.bg_mode, safeEvent.bg_images]);


  useEffect(() => {
    if (typeof forcedPage === "number") {
      setPage(forcedPage);
      setStarted(true);
    }
  }, [forcedPage]);

  const changePage = (next: number) => {
    if (next < 0 || next >= SLIDES.length) return;
    setFade(true);
    setTimeout(() => {
      setPage(next);
      setFade(false);
    }, 200);
  };
const submitRSVP = async () => {
  if (!mainName || attending === null) {
    setError("Please enter your name and choose an option.");
    return;
  }

  

  setSending(true);
  setError(null);

  const { error: dbError } = await supabase.from("rsvps").insert({
    event_id: event.id,
    main_name: mainName,
  guest_count: guestCount,
    attending,
    note,
  });

  setSending(false);

  if (dbError) {
    setError("Database error: " + dbError.message);
  } else {
    setSent(true);
  }
};



  const current = SLIDES[page];

const onPhotoTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
  setIsDragging(true);
};

const onPhotoTouchMove = (e: React.TouchEvent) => {
  if (touchStartX.current === null) return;
  const diff = e.touches[0].clientX - touchStartX.current;
  setPhotoOffset(diff);
};

const onPhotoTouchEnd = () => {
  if (touchStartX.current === null) return;

  const threshold = 60;

  if (photoOffset > threshold) {
    // swipe right → previous
setPhotoIndex((i) =>
  i === 0 ? gallery.length - 1 : i - 1
);
  } else if (photoOffset < -threshold) {
    // swipe left → next
setPhotoIndex((i) =>
  i === gallery.length - 1 ? 0 : i + 1
);
  }

  setPhotoOffset(0);
  setIsDragging(false);
  touchStartX.current = null;
};


  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white">
      {/* Video */}
{/* BACKGROUND */}
{safeEvent.bg_mode === "video" && safeEvent.bg_video && (
  <video
    ref={videoRef}
    className="absolute inset-0 w-full h-full object-cover"
    src={safeEvent.bg_video}
    loop
    playsInline
    muted={muted}
    autoPlay={started}
  />
)}


{safeEvent.bg_mode === "slideshow" && bgImages.length > 0 && (
  <div className="absolute inset-0">
{bgImages.map((img, i) => (
  <img
    key={i}
    src={`${img}?width=1200&quality=70`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          i === bgIndex ? "opacity-100" : "opacity-0"
        }`}
      />
    ))}
  </div>
)}

      {/* Music */}
{safeEvent.music_url && (
  <audio
    ref={audioRef}
    src={safeEvent.music_url}
    loop
    muted={muted}
    autoPlay={started}
  />
)}


      {/* Overlay */}
      <div className={`absolute inset-0 ${template.overlay}`} />

{/* Vignette */}
<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />


{/* START OVERLAY - LUXURY */}
{!started && !editorMode && (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-6 animate-fadeIn">
      <div className="text-white/80 tracking-[0.3em] text-xs uppercase">
        You are invited
      </div>

      <button
        onClick={() => {
          setStarted(true);
          setMuted(false);

          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }

          if (audioRef.current) {
            audioRef.current.volume = 0;
            audioRef.current.play().catch(() => {});
            // Soft fade-in music
            let v = 0;
            const fade = setInterval(() => {
              v += 0.05;
              if (audioRef.current) audioRef.current.volume = Math.min(v, 1);
              if (v >= 1) clearInterval(fade);
            }, 100);
          }
        }}
        className="px-10 py-4 rounded-full border border-white/40 text-white text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md"
      >
        ✦ Enter Invitation ✦
      </button>

      <div className="text-white/50 text-xs tracking-widest">
        Tap to begin
      </div>
    </div>
  </div>
)}



      {/* Content */}
<div
  className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-all duration-700 ${
!started
  ? "opacity-100"
      : fade
      ? "opacity-0 scale-[0.98]"
      : "opacity-100 scale-100"
  }`}
  onTouchStart={(e) => {
    touchStartX.current = e.touches[0].clientX;
  }}
  onTouchEnd={(e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 60;

    if (diff > threshold) {
      changePage(page - 1); // swipe right → previous
    } else if (diff < -threshold) {
      changePage(page + 1); // swipe left → next
    }

    touchStartX.current = null;
  }}
>


        {/* HERO */}
{current === "hero" && (
  <div className="flex flex-col items-center justify-center text-center px-6">
    {/* Names */}
    <h1 className="text-white text-5xl font-semibold mb-6 font-[cursive] leading-tight">
      {safeEvent.hero_names || "Joe & Dayane"}
    </h1>

    {/* Tagline */}
    <p className="text-white/90 text-lg mb-6">
      {safeEvent.hero_tagline || "Together in Christ, Forever in Love"}
    </p>

    {/* Headline */}
    <h2 className="text-white text-2xl font-medium">
      {safeEvent.hero_headline || "The wedding day has arrived!"}
    </h2>
  </div>
)}


        {/* INVITATION */}
{current === "invitation" && (
  <div className="text-center space-y-4 px-4">
    {/* Quote */}
    <p className="text-sm italic text-white/90">
      {safeEvent.invitation_quote}
    </p>

    {/* Parents */}
    <div className="flex justify-between text-sm mt-4">
      <div className="whitespace-pre-line text-left">
        {safeEvent.invitation_parents_left}
      </div>
      <div className="whitespace-pre-line text-right">
        {safeEvent.invitation_parents_right}
      </div>
    </div>

    {/* Request line */}
    <p className="text-sm mt-4">
      {safeEvent.invitation_request_line}
    </p>

    {/* Names */}
    <h1 className="text-3xl font-bold mt-4">
      {safeEvent.hero_names}
    </h1>

    {/* Date */}
    <p className="text-lg mt-2">
      {safeEvent.date_text}
    </p>

    {/* Time */}
    <p className="text-lg">
      {safeEvent.time_text}
    </p>
  </div>
)}


{current === "ceremony" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-6">
    <h2 className="text-3xl font-bold">Wedding Ceremony</h2>

    <div className="text-lg">📍 {safeEvent.ceremony_place}</div>
    <div className="text-lg">{safeEvent.ceremony_time}</div>

    {safeEvent.ceremony_map && (
      <a
        href={safeEvent.ceremony_map}
        target="_blank"
        className="inline-block mt-2 border border-white px-6 py-2 rounded"
      >
        Map
      </a>
    )}
  </div>
)}

{current === "celebration" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-6">
    <h2 className="text-3xl font-bold">The Celebration</h2>

    <div className="text-lg">📍 {safeEvent.celebration_place}</div>
    <div className="text-lg">{safeEvent.celebration_time}</div>

    {safeEvent.celebration_map && (
      <a
        href={safeEvent.celebration_map}
        target="_blank"
        className="inline-block mt-2 border border-white px-6 py-2 rounded"
      >
        Map
      </a>
    )}
  </div>
)}


        {/* RSVP */}
        {current === "rsvp" && (
  <div className="w-full max-w-sm bg-black/50 border border-white/20 rounded-2xl p-5 space-y-4">
    <h2 className="text-2xl font-bold">Be Our Guest</h2>
    <p className="text-sm text-white/80">Please reply before the wedding</p>

    {sent ? (
      <p className="text-green-400 font-semibold">Thank you! ❤️</p>
    ) : (
      <>
        <input
          className="w-full bg-black/40 border border-white/30 rounded px-3 py-2"
          placeholder="Your name"
          value={mainName}
          onChange={(e) => setMainName(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded border ${
              attending === true ? "bg-green-500 text-black" : "border-white/30"
            }`}
            onClick={() => setAttending(true)}
          >
            Joyfully Accept
          </button>
          <button
            className={`flex-1 py-2 rounded border ${
              attending === false ? "bg-red-500 text-black" : "border-white/30"
            }`}
            onClick={() => setAttending(false)}
          >
            Regretfully Decline
          </button>
        </div>
{attending && (
  <div className="space-y-1">
    <label className="text-sm text-white/80">Number of guests</label>
    <input
      type="number"
      min={1}
      className="w-full bg-black/40 border border-white/30 rounded px-3 py-2"
      value={guestCount}
      onChange={(e) => setGuestCount(Number(e.target.value) || 1)}
    />
  </div>
)}


        <textarea
          className="w-full bg-black/40 border border-white/30 rounded px-3 py-2"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={submitRSVP}
          disabled={sending}
          className="w-full py-2 bg-white text-black rounded font-semibold"
        >
          {sending ? "Sending..." : "Submit"}
        </button>
      </>
    )}
  </div>
)}


        {/* PHOTOS */}
        {current === "photos" && (
  <div
    className="relative w-full h-full flex items-center justify-center overflow-hidden"
    onTouchStart={onPhotoTouchStart}
    onTouchMove={onPhotoTouchMove}
    onTouchEnd={onPhotoTouchEnd}
  >
    {gallery.length === 0 ? (
      <p>No photos yet</p>
    ) : (
      <>
<div
  className="flex"
  style={{
    transform: `translateX(calc(${-photoIndex * 100}% + ${photoOffset}px))`,
    transition: isDragging ? "none" : "transform 0.5s ease",
    width: `${gallery.length * 100}%`,
  }}
>
  {gallery.map((img, i) => (
    <div key={i} className="w-full flex-shrink-0 flex justify-center">
<img
  src={`${img}?width=800&quality=70`}
  className="w-[90%] h-[70vh] object-cover rounded-2xl shadow-xl"
/>
    </div>
  ))}
</div>

        {/* Dots (Instagram style) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhotoIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === photoIndex ? "bg-white scale-110" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </>
    )}
  </div>
)}

        {/* GIFTS */}
{current === "gifts" && (
  <div className="w-full max-w-sm bg-black/40 border border-white/20 rounded-2xl p-6 text-center space-y-4 backdrop-blur">
    <h2 className="text-3xl font-bold">Gift Registry</h2>

    <p className="text-sm text-white/80">
      Your love and presence are the best gifts. For those who wish, a wedding list is available.
    </p>

    <div className="space-y-4 mt-4 max-h-64 overflow-y-auto pr-1">
{safeEvent.gifts?.length === 0 && (
    <p className="text-white/60 text-sm">No gift methods added.</p>
  )}

  {safeEvent.gifts?.map((g, i) => (
    <div
      key={i}
      className="border border-white/20 rounded-xl p-4 flex items-center justify-between gap-3 bg-black/30"
    >
      <div className="text-left">
        <div className="text-lg font-semibold">{g.label || "Gift Method"}</div>
        <div className="text-sm text-white/80 break-all">{g.value}</div>
      </div>

      <button
        className="px-3 py-2 border border-white/30 rounded"
        onClick={() => {
          if (g.value) {
            navigator.clipboard.writeText(g.value);
            alert("Copied!");
          }
        }}
        title="Copy"
      >
        📋
      </button>
    </div>
  ))}
</div>

  </div>
)}
{/* ENDING */}
{current === "ending" && (
  <div className="relative w-full h-full flex items-center justify-center flex-col">
    
    {safeEvent.ending_photo && (
      <div className="bg-white rounded-lg p-3 shadow-2xl transform -rotate-6 mb-6">
        <div className="w-56 h-72 overflow-hidden rounded">
<img
  src={`${safeEvent.ending_photo}?width=1000&quality=70`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )}

    <div className="text-center text-white font-serif text-2xl px-6">
      {safeEvent.ending_message || "Happily ever after"}
    </div>

    {/* Subtle brand / footer */}
    <div className="absolute bottom-6 text-xs text-white/60 tracking-widest">
      3AZIMEH
    </div>
  </div>
)}



      </div>

{/* Music Toggle */}
{safeEvent.music_url && started && (
  <button
onClick={() => {
  setMuted((m) => {
    const next = !m;
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
    return next;
  });
}}

    className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur px-3 py-2 rounded-full text-white text-sm border border-white/30"
  >
    {muted ? "🔇" : "🔊"}
  </button>
)}


{/* Navigation (guest only) */}
{started && (
  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-20 pointer-events-none">
    <button
      onClick={() => changePage(page - 1)}
      disabled={page === 0}
      className="pointer-events-auto bg-black/50 w-10 h-10 rounded-full"
    >
      ‹
    </button>
    <button
      onClick={() => changePage(page + 1)}
      disabled={page === SLIDES.length - 1}
      className="pointer-events-auto bg-black/50 w-10 h-10 rounded-full"
    >
      ›
    </button>
  </div>
)}

    </div>
  );
}
