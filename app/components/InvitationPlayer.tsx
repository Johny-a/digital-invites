"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const isMobile =
  typeof window !== "undefined" && window.innerWidth < 768;

const getOptimizedSrc = (src: string) =>
  isMobile
    ? `${src}?width=600&quality=50`
    : `${src}?width=1200&quality=70`;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EventData = {
  id?: string;

  ending_photo: string;
event_date_iso?: string;
  bg_mode?: "video" | "slideshow";
  bg_images?: Record<string, string>;
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

after_place?: string;
after_time?: string;
after_map?: string;
after_note?: string;

  ceremony_place?: string;
ceremony_note?: string;
  ceremony_time?: string;
  ceremony_map?: string;

  celebration_place?: string;
  celebration_time?: string;
  celebration_map?: string;

  video_url?: string;

  gallery?: string[];

  gifts?: { label: string; value: string; logo?: string }[];
gift_note?: string;
  ending_message?: string;

  template_id?: string;

  text_positions?: {
    heroTitle?: { x: number; y: number };
    heroSubtitle?: { x: number; y: number };
    invitationBlock?: { x: number; y: number };
  };
};
const BASE_SLIDES = [
  "hero",
  "invitation",
  "ceremony",
  "celebration",
  "gifts",
  "rsvp",
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

  // ✅ ADD HERE
  const loadImage = (src: string) =>
    new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

  const safeEvent: EventData = {
  ...event,
  gallery: Array.isArray(event?.gallery) ? event.gallery : [],
  bg_images: event?.bg_images || {},
  gifts: Array.isArray(event?.gifts) ? event.gifts : [],
  text_positions: event?.text_positions || {},
};
const gallery = safeEvent.gallery ?? [];
const hasAfter =
  safeEvent.after_place ||
  safeEvent.after_time ||
  safeEvent.after_map ||
  safeEvent.after_note;

const dynamicSlides = [
  "hero",
  "invitation",
  "ceremony",
  ...(hasAfter ? ["after"] : []), // ✅ ONLY SHOW IF FILLED
  "celebration",
  "gifts",
  "rsvp",
];

const SLIDES = gallery.length > 0
  ? [...dynamicSlides, "photos", "ending"]
  : [...dynamicSlides, "ending"];
const bgImages = safeEvent.bg_images || {};
const [assetsReady, setAssetsReady] = useState(false);
const [loadingProgress, setLoadingProgress] = useState(0);
const [firstBgLoaded, setFirstBgLoaded] = useState(false);

const [mainName, setMainName] = useState("");
const [attending, setAttending] = useState<boolean | null>(null);
const [note, setNote] = useState("");
const [sending, setSending] = useState(false);
const [sent, setSent] = useState(false);
const [error, setError] = useState<string | null>(null);
const [guestCount, setGuestCount] = useState(0);

// ⏳ COUNTDOWN STATE
const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});



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

// PRELOAD ALL MEDIA AND WAIT UNTIL FINISHED
useEffect(() => {
  let isMounted = true;

  

  const loadInitial = async () => {
    // 👇 ONLY load 1–2 assets before enter
    const tasks: Promise<void>[] = [];

Object.values(safeEvent.bg_images || {}).forEach((src) => {
  if (src) {
    tasks.push(loadImage(getOptimizedSrc(src)));
  }
});
    if (safeEvent.ending_photo) {
      tasks.push(loadImage(getOptimizedSrc(safeEvent.ending_photo)));
    }

    await Promise.all(tasks);

    if (isMounted) {
      setAssetsReady(true); // ✅ THIS unlocks button
    }
  };

  loadInitial();

  return () => {
    isMounted = false;
  };
}, []);

useEffect(() => {
  if (!started) return;

  let isMounted = true;

const loadVideo = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement("video");
    video.src = src;
    video.preload = "auto";

    const checkReady = () => {
      if (video.readyState >= 4) {
        resolve();
      }
    };

    video.addEventListener("canplaythrough", checkReady);
    video.onerror = () => resolve();
  });

  const loadAudio = (src: string) =>
    new Promise<void>((resolve) => {
      const audio = document.createElement("audio");
      audio.src = src;
      audio.preload = "auto";

      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => resolve();
    });

  const loadAll = async () => {
    const tasks: Promise<void>[] = [];

    // Background images
Object.values(safeEvent.bg_images || {}).forEach((src) => {
  if (src) {
    tasks.push(loadImage(getOptimizedSrc(src)));
  }
});
    // Gallery images
    // only preload first 2 images
safeEvent.gallery?.slice(0, 2).forEach((src) => {
  tasks.push(loadImage(getOptimizedSrc(src)));
});

    // Ending photo
    if (safeEvent.ending_photo) {
      tasks.push(loadImage(getOptimizedSrc(safeEvent.ending_photo)));
    }


    

    // Music
    if (safeEvent.music_url) {
      tasks.push(loadAudio(safeEvent.music_url));
    }

    let loaded = 0;
    tasks.forEach((p) =>
      p.then(() => {
        loaded++;
        if (isMounted) {
          setLoadingProgress(loaded);
        }
      })
    );

    await Promise.all(tasks);

    if (isMounted) {
      setAssetsReady(true);
    }
  };
const init = async () => {
  const firstBg = Object.values(safeEvent.bg_images || {})[0];

if (firstBg) {
  await loadImage(getOptimizedSrc(firstBg));
  if (isMounted) setFirstBgLoaded(true);
}

  await loadAll();
};

init();

  return () => {
    isMounted = false;
  };
}, [started]);



  useEffect(() => {
    if (typeof forcedPage === "number") {
      setPage(forcedPage);
      setStarted(true);
    }
  }, [forcedPage]);

// ⏳ COUNTDOWN EFFECT
useEffect(() => {
  if (!safeEvent.event_date_iso) return;

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const targetDate = new Date(safeEvent.event_date_iso!).getTime();

    const difference = targetDate - now;

    if (difference <= 0) {
      clearInterval(interval);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    });
  }, 1000);

  return () => clearInterval(interval);
}, [safeEvent.event_date_iso]);

  const changePage = (next: number) => {
    if (next < 0 || next >= SLIDES.length) return;
    setFade(true);
    setTimeout(() => {
      setPage(next);
      setFade(false);
    }, 200);
  };
const submitRSVP = async () => {
  if (!mainName || attending === null || guestCount < 0) {
  setError("Please fill all fields.");
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
const totalAssets =
  Object.values(safeEvent.bg_images || {}).filter(Boolean).length +
  (safeEvent.gallery?.length ?? 0) +
  (safeEvent.ending_photo ? 1 : 0) +
  (safeEvent.bg_video ? 1 : 0) +
  (safeEvent.music_url ? 1 : 0);
const progressPercent = Math.min(
  (loadingProgress / Math.max(totalAssets, 1)) * 100,
  100
);
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
      {/* BACKGROUND */}

{safeEvent.bg_mode === "video" && safeEvent.bg_video && (
  <video
    ref={videoRef}
    className="absolute inset-0 w-full h-full object-cover scale-110 animate-slowZoom"
    src={safeEvent.bg_video}
    loop
    playsInline
    muted={muted}
    autoPlay={started}
    preload="metadata"
    style={{ display: started ? "block" : "none" }}
  />
)}

{safeEvent.bg_mode === "slideshow" && (
  <div className="absolute inset-0">
    {(() => {
      const currentKey = SLIDES[page];
      const bg = safeEvent.bg_images?.[currentKey];

      if (!bg) return null;

      return (
        <img
          key={page}
          src={getOptimizedSrc(bg)}
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-700 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        />
      );
    })()}
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
  preload="auto"
  style={{ display: started ? "block" : "none" }}
/>
)}

{!started && firstBgLoaded && safeEvent.bg_images?.[0] && (
  <img
    src={getOptimizedSrc(safeEvent.bg_images[0])}
loading="lazy"
  crossOrigin="anonymous"
    className="absolute inset-0 w-full h-full object-cover blur-md scale-105 opacity-70"
  />
)}

      {/* Overlay */}
      <div className={`absolute inset-0 ${template.overlay}`} />

{/* Vignette */}
<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />


{!started && !editorMode && (
  <div className={`absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-700 ${
  started ? "opacity-0 pointer-events-none" : "opacity-100"
}`}>

    {/* Background blur */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

    {/* Content */}
    <div className="relative flex flex-col items-center gap-8 text-center px-6">

      {/* Logo / Names */}
      <div className="text-white/80 text-xs tracking-[0.4em] uppercase">
        Wedding Invitation
      </div>

      {/* Main Title */}
      <div className="text-white text-3xl font-serif tracking-wide">
        {safeEvent.hero_names || "You're Invited"}
      </div>

      {/* Loader OR Enter */}
      {!assetsReady ? (
        <div className="flex flex-col items-center gap-4 w-64">

          {/* Animated bar */}
          <div className="w-full h-[2px] bg-white/20 overflow-hidden relative">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-white/60 text-xs tracking-widest">
            Preparing your experience...
          </div>

          {/* subtle spinner */}
          <div className="w-6 h-6 border border-white/30 border-t-white rounded-full animate-spin" />

        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-fadeIn">

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
                let v = 0;
                const fade = setInterval(() => {
                  v += 0.05;
                  if (audioRef.current)
                    audioRef.current.volume = Math.min(v, 1);
                  if (v >= 1) clearInterval(fade);
                }, 100);
              }
            }}
            className="px-10 py-4 rounded-full border border-white/40 text-white text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md"
          >
            ✦ Enter Invitation ✦
          </button>

          <div className="text-white/50 text-xs tracking-widest">
            Tap to begin
          </div>

        </div>
      )}
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
  } ${started ? "animate-fadeIn" : ""}`}
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
<div className="flex flex-col items-center justify-center mb-6 leading-tight">
  {safeEvent.hero_names?.split("&")[0] && (
    <div className="text-white text-5xl font-semibold text-center font-[cursive]">
      {safeEvent.hero_names.split("&")[0].trim()}
    </div>
  )}

  <div className="text-white text-4xl font-light my-2">&</div>

  {safeEvent.hero_names?.split("&")[1] && (
    <div className="text-white text-5xl font-semibold text-center font-[cursive]">
      {safeEvent.hero_names.split("&")[1].trim()}
    </div>
  )}
</div>
    {/* Tagline */}
    <p className="text-white/90 text-lg mb-6">
      {safeEvent.hero_tagline || "Together in Christ, Forever in Love"}
    </p>

    {/* Headline */}
    <h2 className="text-white text-2xl font-medium">
      {safeEvent.hero_headline || "The wedding day has arrived!"}
    </h2>
{/* ⏳ COUNTDOWN */}
<div className="mt-6 flex gap-4 text-center">
  {[
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ].map((item, i) => (
    <div key={i} className="bg-white/10 px-4 py-2 rounded-lg">
      <div className="text-xl font-bold">{item.value}</div>
      <div className="text-xs text-white/70">{item.label}</div>
    </div>
  ))}
</div>
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
<div className="flex flex-col items-center justify-center mt-6 leading-tight">
  {safeEvent.hero_names?.split("&")[0] && (
    <div className="text-3xl font-bold text-center">
      {safeEvent.hero_names.split("&")[0].trim()}
    </div>
  )}

  <div className="text-2xl font-light my-1">&</div>

  {safeEvent.hero_names?.split("&")[1] && (
    <div className="text-3xl font-bold text-center">
      {safeEvent.hero_names.split("&")[1].trim()}
    </div>
  )}
</div>

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

    {/* ✅ NEW TEXT */}
    {safeEvent.ceremony_note && (
      <p className="text-sm text-white/80 max-w-xs">
        {safeEvent.ceremony_note}
      </p>
    )}

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



{current === "after" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-6">

<h2 className="text-2xl font-bold leading-snug max-w-xs">
  {safeEvent.after_note}
</h2>
 

    {/* LOCATION */}
    {safeEvent.after_place && (
      <div className="text-lg">📍 {safeEvent.after_place}</div>
    )}

    {/* TIME */}
    {safeEvent.after_time && (
      <div className="text-lg">{safeEvent.after_time}</div>
    )}

    {/* MAP */}
    {safeEvent.after_map && (
      <a
        href={safeEvent.after_map}
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
    <p className="text-sm text-white/80">
  Kindly confirm your attendance and number of guests
</p>

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

<div className="space-y-1">
  <label className="text-sm text-white/80">
    Number of guests
  </label>

  <input
    type="number"
    inputMode="numeric"
    min="0"
    className="w-full bg-black/40 border border-white/30 rounded px-3 py-2 appearance-none"
    value={guestCount}
    onChange={(e) => {
      const val = Math.max(0, Number(e.target.value));
      setGuestCount(val);
    }}
  />
</div>

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
  src={getOptimizedSrc(img)}
loading="lazy"
  crossOrigin="anonymous"
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

{safeEvent.gift_note && (
  <p className="text-sm text-white/70 mt-2">
    {safeEvent.gift_note}
  </p>
)}

    <div className="space-y-4 mt-4 max-h-64 overflow-y-auto pr-1">
{safeEvent.gifts?.length === 0 && (
    <p className="text-white/60 text-sm">No gift methods added.</p>
  )}

  {safeEvent.gifts?.map((g, i) => (
<div
  key={i}
  className="border border-white/20 rounded-xl p-4 flex items-center justify-between gap-3 bg-black/30"
>
  {/* LEFT: TEXT */}
  <div className="text-left">
    <div className="text-lg font-semibold">
      {g.label || "Gift Method"}
    </div>
    <div className="text-sm text-white/80 break-all">
      {g.value}
    </div>
  </div>

  {/* RIGHT: LOGO (click = copy) */}
  {g.logo && (
    <div
      onClick={() => {
        if (g.value) {
          navigator.clipboard.writeText(g.value);
alert("Copied!");
        }
      }}
      className="cursor-pointer border border-white/20 rounded-lg p-2 bg-white/10 hover:bg-white/20 transition"
    >
      <img
        src={g.logo}
        alt={g.label}
        className="w-6 h-6 object-contain"
      />
    </div>
  )}
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
  src={getOptimizedSrc(safeEvent.ending_photo)}
loading="lazy"
  crossOrigin="anonymous"
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
