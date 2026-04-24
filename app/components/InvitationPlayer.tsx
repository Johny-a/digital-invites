"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
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
parents_label_en?: string;
parents_label_ar?: string;


  ending_photo: string;
event_date_iso?: string;
  bg_mode?: "video" | "slideshow";
  bg_images?: Record<string, string>;
  bg_video?: string;
  music_url?: string;

groom_title?: string;
groom_title_ar?: string;
groom_note?: string;
groom_note_ar?: string;

bride_title?: string;
bride_title_ar?: string;
bride_note?: string;
bride_note_ar?: string;

houses_footer?: string;
houses_footer_ar?: string;

groom_place?: string;
groom_place_ar?: string;
groom_map?: string;

bride_place?: string;
bride_place_ar?: string;
bride_map?: string;

houses_title?: string;
houses_title_ar?: string;

  title?: string;
  subtitle?: string;

celebration_note_bottom?: string;
celebration_note_bottom_ar?: string;

celebration_note?: string;
celebration_note_ar?: string;

  date_text?: string;
date_text_ar?: string;

time_text?: string;
time_text_ar?: string;
  location_text?: string;

  hero_names: string;
hero_names_ar?: string;
hero_tagline_ar?: string;
hero_headline_ar?: string;

parents_label_left_en?: string;
parents_label_left_ar?: string;
parents_label_right_en?: string;
parents_label_right_ar?: string;

invitation_quote_ar?: string;
invitation_parents_left_ar?: string;
invitation_parents_right_ar?: string;
invitation_request_line_ar?: string;

ceremony_note_ar?: string;
ceremony_place_ar?: string;
ceremony_time_ar?: string;

celebration_place_ar?: string;
celebration_time_ar?: string;

ending_message_ar?: string;
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


after_place_ar?: string;
after_time_ar?: string;
after_note_ar?: string;

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
gift_note_ar?: string;
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
  language: externalLang,
}: {
  event: EventData;
  templateId?: string;
  editorMode?: boolean;
  forcedPage?: number;
  language?: "en" | "ar"; // 🔥 ADD THIS
}) {

  // ✅ ADD HERE
  const loadImage = (src: string) =>
    new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

  const safeEvent = useMemo(() => ({
  ...event,
  gallery: Array.isArray(event?.gallery) ? event.gallery : [],
  bg_images: event?.bg_images || {},
  gifts: Array.isArray(event?.gifts) ? event.gifts : [],
  text_positions: event?.text_positions || {},
}), [event]);
const gallery = safeEvent.gallery ?? [];
const hasAfter =
  safeEvent.after_place ||
  safeEvent.after_time ||
  safeEvent.after_map ||
  safeEvent.after_note;

const hasHouses =
  safeEvent.groom_place ||
  safeEvent.bride_place;

const dynamicSlides = [
  "hero",
  "invitation",
  ...(hasHouses ? ["houses"] : []), // ✅ NEW PAGE HERE
  "ceremony",
  ...(hasAfter ? ["after"] : []),
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
const [guestCount, setGuestCount] = useState<number | "">("");
const normalizeNumber = (val: string) => {
  return val
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    .replace(/[^\d]/g, "");
};

// ⏳ COUNTDOWN STATE
const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});



const template = TEMPLATES[templateId] || TEMPLATES.classic;

const [page, setPage] = useState(0);

const current = SLIDES[page];

const [language, setLanguage] = useState<"en" | "ar" | null>(
  externalLang || null
);
useEffect(() => {
  if (editorMode && externalLang) {
    setLanguage(externalLang);
  }
}, [externalLang, editorMode]);
const [started, setStarted] = useState(editorMode);
const [muted, setMuted] = useState(editorMode ? true : false);
const [fade, setFade] = useState(false);
useEffect(() => {
  if (!started) return;

  // ✅ 🚫 IMPORTANT: disable autoplay in editor
  if (editorMode) return;

  // 🛑 STOP on RSVP until user submits
  if (current === "rsvp" && !sent) return;

  const delay =
    current === "rsvp" && sent
      ? 5000
      : 10000;

  const interval = setInterval(() => {
    setPage((prev) => {
      if (prev >= SLIDES.length - 1) return 0;
      return prev + 1;
    });
  }, delay);

  return () => clearInterval(interval);
}, [started, current, sent, SLIDES.length, editorMode]);

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

    // ✅ only start in editor without triggering full flow
    if (editorMode) {
      setStarted(true);
    }
  }
}, [forcedPage, editorMode]);

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
  if (!mainName || attending === null || guestCount === "" || Number(normalizeNumber(String(guestCount))) < 1) {
    setError("Guest count must be at least 1.");
    return;
  }

  setSending(true);
  setError(null);

  const { error: dbError } = await supabase.from("rsvps").insert({
    event_id: event.id,
    main_name: mainName,
    guest_count: Number(normalizeNumber(String(guestCount))) || 1,
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

const translations = {
  en: {
    enter: "✦ Enter Invitation ✦",
    tap: "Tap to begin",
    preparing: "Preparing your experience...",
    weddingInvitation: "Wedding Invitation",
    days: "Days",
    hours: "Hours",
    min: "Min",
    sec: "Sec",
    ceremony: "Wedding Ceremony",
    celebration: "The Celebration",
    giftRegistry: "Gift Registry",
    submit: "Submit",
  },

  ar: {
    enter: "✦ دخول الدعوة ✦",
    tap: "اضغط للبدء",
    preparing: "جارٍ تجهيز التجربة...",
    weddingInvitation: "دعوة زفاف",
    days: "أيام",
    hours: "ساعات",
    min: "دقائق",
    sec: "ثواني",
    ceremony: "مراسم الزفاف",
    celebration: "الاحتفال",
    giftRegistry: "قائمة الهدايا",
    submit: "إرسال",
  },
};
const getText = (en?: string, ar?: string) => {
  if (language === "ar") return ar || en || "";
  return en || "";
};
const heroNames = getText(
  safeEvent.hero_names,
  safeEvent.hero_names_ar
);

const t = (key: keyof typeof translations.en) => {

  if (!language) return translations.en[key];
  return translations[language][key];
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
    <div
  dir={language === "ar" ? "rtl" : "ltr"}
className={`relative w-full h-full overflow-hidden bg-black text-white ${
  language === "ar"
    ? "font-[Amiri] tracking-normal leading-relaxed"
    : ""
}`}

>
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
      <div
  className={`text-white text-2xl md:text-3xl tracking-[0.2em] ${
    language === "ar"
      ? "font-[Amiri] font-semibold"
      : "uppercase"
  }`}
>
  {t("weddingInvitation")}
</div>
      {/* Main Title */}
      <div className="text-white text-3xl font-serif tracking-wide">
        {getText(safeEvent.hero_names, safeEvent.hero_names_ar) || "You're Invited"}
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
            {t("preparing")}
          </div>

          {/* subtle spinner */}
          <div className="w-6 h-6 border border-white/30 border-t-white rounded-full animate-spin" />

        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 animate-fadeIn">

  {/* 🌍 LANGUAGE SELECT */}
  
<div className="flex gap-4">
  <button
    onClick={() => setLanguage("en")}
    className={`px-4 py-2 rounded border ${
      language === "en"
        ? "bg-white text-black"
        : "border-white/40 text-white"
    }`}
  >
    English
  </button>

  <button
    onClick={() => setLanguage("ar")}
    className={`px-4 py-2 rounded border ${
      language === "ar"
        ? "bg-white text-black"
        : "border-white/40 text-white"
    }`}
  >
    العربية
  </button>
</div>

  {/* 🚀 START BUTTON */}
  {language !== null && (
    <>
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
        {t("enter")}
      </button>

      <div className="text-white/50 text-xs tracking-widest">
        {t("tap")}
      </div>
    </>
  )}


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
  
  {heroNames?.split("&")[0] && (
  <div className={`text-white text-5xl font-semibold text-center ${
    language === "ar" ? "font-[Amiri]" : "font-[cursive]"
  }`}>
    {heroNames.split("&")[0].trim()}
  </div>
)}

<div className={`text-white my-2 ${
  language === "ar" ? "text-3xl" : "text-4xl"
}`}>
  {language === "ar" ? "و" : "&"}
</div>

{heroNames?.split("&")[1] && (
  <div className={`text-white text-5xl font-semibold text-center ${
    language === "ar" ? "font-[Amiri]" : "font-[cursive]"
  }`}>
    {heroNames.split("&")[1].trim()}
  </div>
)}
</div>
    {/* Tagline */}
    <p className="text-white/90 text-lg mb-6">
      {getText(safeEvent.hero_tagline, safeEvent.hero_tagline_ar) || "Together in Christ, Forever in Love"}
    </p>

    {/* Headline */}
    <h2 className="text-white text-2xl font-medium">
      {getText(safeEvent.hero_headline, safeEvent.hero_headline_ar) || "The wedding day has arrived!"}
    </h2>
{/* ⏳ COUNTDOWN */}
<div className="mt-6 flex gap-4 text-center">
  {[
    { label: t("days"), value: timeLeft.days },
{ label: t("hours"), value: timeLeft.hours },
{ label: t("min"), value: timeLeft.minutes },
    { label: t("sec"), value: timeLeft.seconds },
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
  <div className="space-y-6 px-6 text-center max-w-md mx-auto">
    {/* Quote */}
<p
  className={`italic text-white/90 leading-loose tracking-wide ${
    language === "ar" ? "text-xl md:text-2xl" : "text-lg md:text-xl"
  }`}
>
  {getText(safeEvent.invitation_quote, safeEvent.invitation_quote_ar)}
</p>

    {/* Parents */}
    {/* Parents */}
<div className="grid grid-cols-2 gap-6 mt-4 text-center">

  {/* LEFT */}
  <div className="space-y-1">
<div
  className={`${
    language === "ar"
      ? "text-lg font-[Amiri] font-bold text-white tracking-normal"
      : "text-sm uppercase tracking-widest text-white/70"
  }`}
>
{getText(
  safeEvent.parents_label_left_en || "Mr & Mrs",
  safeEvent.parents_label_left_ar || "السيد والسيدة"
)}
</div>
    <div className="text-lg font-medium whitespace-pre-line">
      {getText(
        safeEvent.invitation_parents_left,
        safeEvent.invitation_parents_left_ar
      )}
    </div>
  </div>

  {/* RIGHT */}
  <div className="space-y-1">
<div
  className={`${
    language === "ar"
      ? "text-lg font-[Amiri] font-bold text-white tracking-normal"
      : "text-sm uppercase tracking-widest text-white/70"
  }`}
>
{getText(
  safeEvent.parents_label_right_en || "Mr & Mrs",
  safeEvent.parents_label_right_ar || "السيد والسيدة"
)}
</div>
    <div className="text-lg font-medium whitespace-pre-line">
      {getText(
        safeEvent.invitation_parents_right,
        safeEvent.invitation_parents_right_ar
      )}
    </div>
  </div>

</div>
      


    {/* Request line */}
    <p className="text-base md:text-lg mt-6 leading-relaxed">
      {getText(safeEvent.invitation_request_line, safeEvent.invitation_request_line_ar)}
    </p>{/* 👰🤵 HERO NAMES (BIG + STACKED) */}
<div className="flex flex-col items-center mt-6 leading-tight">

  {heroNames?.split("&")[0] && (
    <div
      className={`${
        language === "ar"
          ? "text-4xl md:text-5xl font-[Amiri] font-bold"
          : "text-3xl md:text-4xl font-serif font-bold"
      }`}
    >
      {heroNames.split("&")[0].trim()}
    </div>
  )}

  <div
    className={`my-1 ${
      language === "ar" ? "text-3xl" : "text-3xl"
    }`}
  >
    {language === "ar" ? "و" : "&"}
  </div>

  {heroNames?.split("&")[1] && (
    <div
      className={`${
        language === "ar"
          ? "text-4xl md:text-5xl font-[Amiri] font-bold"
          : "text-3xl md:text-4xl font-serif font-bold"
      }`}
    >
      {heroNames.split("&")[1].trim()}
    </div>
  )}

</div>

{/* Names */}

    {/* Date */}
    <p className="text-xl font-semibold mt-6">
  {getText(safeEvent.date_text, safeEvent.date_text_ar)}
</p>

<p className="text-xl">
  {getText(safeEvent.time_text, safeEvent.time_text_ar)}
</p>
  </div>
)}


{current === "houses" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-4">

    {/* TITLE */}
    <h2 className={`text-3xl md:text-4xl ${
      language === "ar" ? "font-[Amiri]" : "font-serif"
    }`}>
      {getText(
        safeEvent.houses_title || "Before the Ceremony",
        safeEvent.houses_title_ar || "قبل المراسم"
      )}
    </h2>

    {/* HOUSES */}
    <div className="flex flex-col gap-6 w-full max-w-md">

      {/* GROOM */}
      {safeEvent.groom_place && (
        <div className="space-y-2 border border-white/20 rounded-xl p-4 bg-black/30 max-h-[38vh] overflow-hidden">

          <h3 className="text-lg font-semibold">
            {getText(
              safeEvent.groom_title || "The Groom’s House",
              safeEvent.groom_title_ar || "منزل العريس"
            )}
          </h3>

          <p className="text-white/70 text-xs leading-snug">
            {getText(
              safeEvent.groom_note || "Join us at the groom’s home to begin the celebration.",
              safeEvent.groom_note_ar || "يسرّنا دعوتكم لبداية الاحتفال في منزل العريس"
            )}
          </p>

          <div className="text-sm">
            📍 {getText(safeEvent.groom_place, safeEvent.groom_place_ar)}
          </div>

          {safeEvent.groom_map && (
            <a href={safeEvent.groom_map} target="_blank"
              className="inline-block border border-white px-3 py-1.5 text-sm rounded">
              {language === "ar" ? "الخريطة" : "Map"}
            </a>
          )}
        </div>
      )}

      {/* BRIDE */}
      {safeEvent.bride_place && (
        <div className="space-y-4 border border-white/20 rounded-xl p-6 bg-black/30">

          <h3 className="text-xl font-semibold">
            {getText(
              safeEvent.bride_title || "The Bride’s House",
              safeEvent.bride_title_ar || "منزل العروس"
            )}
          </h3>

          <p className="text-white/80 text-sm">
            {getText(
              safeEvent.bride_note || "Join us at the bride’s home where beautiful moments begin.",
              safeEvent.bride_note_ar || "ندعوكم لمشاركتنا اللحظات الجميلة في منزل العروس"
            )}
          </p>

          <div className="text-lg">
            📍 {getText(safeEvent.bride_place, safeEvent.bride_place_ar)}
          </div>

          {safeEvent.bride_map && (
            <a href={safeEvent.bride_map} target="_blank"
              className="inline-block border border-white px-4 py-2 rounded">
              {language === "ar" ? "الخريطة" : "Map"}
            </a>
          )}
        </div>
      )}
    </div>

    {/* BOTTOM TEXT */}
    <p className="text-white/70 italic">
      {getText(
        safeEvent.houses_footer || "Two homes… one beautiful beginning",
        safeEvent.houses_footer_ar || "منزلان… وبداية واحدة جميلة"
      )}
    </p>

  </div>
)}



{current === "ceremony" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-6">

 <h2 className="text-3xl font-bold">{t("ceremony")}</h2>

<div className="text-lg">
  📍 {getText(safeEvent.ceremony_place, safeEvent.ceremony_place_ar)}
</div>

<div className="text-lg">
  {getText(safeEvent.ceremony_time, safeEvent.ceremony_time_ar)}
</div>

{/* ✅ MOVE NOTE HERE */}
{safeEvent.ceremony_note && (
  <p
  className={`max-w-xs ${
    language === "ar"
      ? "text-lg font-[Amiri] font-semibold text-white leading-relaxed"
      : "text-sm text-white/80"
  }`}
>
    {getText(
      safeEvent.ceremony_note,
      safeEvent.ceremony_note_ar
    )}
  </p>
)}
    {safeEvent.ceremony_map && (
      <a
        href={safeEvent.ceremony_map}
        target="_blank"
        className="inline-block mt-2 border border-white px-6 py-2 rounded"
      >
        {language === "ar" ? "الخريطة" : "Map"}
      </a>
    )}
  </div>
)}



{current === "after" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-6">

    {/* TITLE */}
    <h2 className="text-2xl md:text-3xl font-semibold leading-snug max-w-xs">
      {getText(
        safeEvent.after_note,
        safeEvent.after_note_ar
      )}
    </h2>

    {/* LOCATION */}
    {safeEvent.after_place && (
      <div className="text-lg">
        📍 {getText(safeEvent.after_place, safeEvent.after_place_ar)}
      </div>
    )}

    {/* TIME */}
    {safeEvent.after_time && (
      <div className="text-lg">
        {getText(safeEvent.after_time, safeEvent.after_time_ar)}
      </div>
    )}

    {/* MAP */}
    {safeEvent.after_map && (
      <a
        href={safeEvent.after_map}
        target="_blank"
        className="inline-block mt-2 border border-white px-6 py-2 rounded"
      >
        {language === "ar" ? "الخريطة" : "Map"}
      </a>
    )}
  </div>
)}

{current === "celebration" && (
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-6">

    <h2 className="text-3xl font-bold">{t("celebration")}</h2>

    {/* ✅ NOTE (FIXED POSITION) */}
    {safeEvent.celebration_note && (
      <p
  className={`max-w-xs ${
    language === "ar"
      ? "text-lg font-[Amiri] text-white leading-relaxed"
      : "text-sm text-white/80"
  }`}
>
        {getText(
          safeEvent.celebration_note,
          safeEvent.celebration_note_ar
        )}
      </p>
    )}

    <div className="text-lg">
      📍 {getText(safeEvent.celebration_place, safeEvent.celebration_place_ar)}
    </div>

    <div className="text-lg">
      {getText(safeEvent.celebration_time, safeEvent.celebration_time_ar)}
    </div>

    {safeEvent.celebration_map && (
      <a
        href={safeEvent.celebration_map}
        target="_blank"
        className="inline-block mt-2 border border-white px-6 py-2 rounded"
      >
        {language === "ar" ? "الخريطة" : "Map"}
      </a>
    )}
{safeEvent.celebration_note_bottom && (
  <p
  className={`max-w-xs mt-4 ${
    language === "ar"
      ? "text-xl font-[Amiri] font-bold text-white underline leading-loose"
      : "text-sm text-white/70"
  }`}
>
    {getText(
      safeEvent.celebration_note_bottom,
      safeEvent.celebration_note_bottom_ar
    )}
  </p>
)}

  </div>
)}

        {/* RSVP */}
        {current === "rsvp" && (
  <div className="w-full max-w-sm bg-black/50 border border-white/20 rounded-2xl p-5 space-y-4">
    <h2 className={`leading-snug max-w-xs ${
  language === "ar"
    ? "text-3xl font-[Amiri]"
    : "text-2xl font-serif"
}`}>
  {language === "ar" ? "تأكيد الحضور" : "RSVP"}
</h2>
    <p className="text-sm text-white/80">

</p>

    {sent ? (
      <p className="text-green-400 font-semibold">{language === "ar" ? "شكراً لك ❤️" : "Thank you! ❤️"}️</p>
    ) : (
      <>
        <input
          className="w-full bg-black/40 border border-white/30 rounded px-3 py-2"
          placeholder={language === "ar" ? "اسمك" : "Your name"}
          value={mainName}
          onChange={(e) => setMainName(e.target.value)}
        />

<div className="space-y-1">
  <label className="text-sm text-white/80">
    {language === "ar" ? "عدد الضيوف" : "Number of guests"}
  </label>

 <input
  type="text"
  inputMode="numeric"
  min="1"
  className="w-full bg-black/40 border border-white/30 rounded px-3 py-2 appearance-none"
  value={guestCount}
  placeholder={language === "ar" ? "عدد الضيوف" : "Enter number of guests"}
  onChange={(e) => {
  const raw = e.target.value;
  const normalized = normalizeNumber(raw);

  if (normalized === "") {
    setGuestCount("");
  } else {
    const num = Number(normalized);
    setGuestCount(num < 1 ? 1 : num);
  }
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
            {language === "ar" ? "سأحضر" : "Joyfully Accept"}
          </button>
          <button
            className={`flex-1 py-2 rounded border ${
              attending === false ? "bg-red-500 text-black" : "border-white/30"
            }`}
            onClick={() => setAttending(false)}
          >
            {language === "ar" ? "لن أحضر" : "Regretfully Decline"}
          </button>
        </div>



        <textarea
          className="w-full bg-black/40 border border-white/30 rounded px-3 py-2"
          placeholder={language === "ar" ? "ملاحظة (اختياري)" : "Optional note"}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={submitRSVP}
          disabled={sending}
          className="w-full py-2 bg-white text-black rounded font-semibold"
        >
          {sending ? "Sending..." : t("submit")}
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
    <h2
  className={`${
    language === "ar"
      ? "text-4xl font-[Amiri] font-bold"
      : "text-3xl font-bold"
  }`}
>
  {t("giftRegistry")}
</h2>

    <p
  className={`whitespace-pre-line ${
    language === "ar"
      ? "text-base font-[Amiri] text-white/90 leading-relaxed"
      : "text-sm text-white/80"
  }`}
>
      {language === "ar"
  ? "وجودكم معنا هو أعظم هدية.\n لمن يرغب لائحة الهدايا."
  : "Your love and presence are the best gifts. For those who wish, a wedding list is available."}
    </p>

{safeEvent.gift_note && (
<p className="text-center text-sm md:text-base text-white/90">
  {getText(safeEvent.gift_note, safeEvent.gift_note_ar)}
</p>
)}

    <div className="space-y-4 mt-4 max-h-64 overflow-y-auto pr-1">
{safeEvent.gifts?.length === 0 && (
    <p className="text-white/60 text-sm">{language === "ar" ? "لا توجد وسائل هدايا" : "No gift methods added."}</p>
  )}

  {safeEvent.gifts?.map((g, i) => (
<div
  key={i}
  className="border border-white/20 rounded-xl p-4 flex items-center justify-between gap-3 bg-black/30"
>
  {/* LEFT: TEXT */}
  <div className="text-left">
    <div className="text-lg font-semibold">
      {g.label || (language === "ar" ? "طريقة الهدية" : "Gift Method")}
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
alert(language === "ar" ? "تم النسخ!" : "Copied!");
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
      {getText(
  safeEvent.ending_message || "Happily ever after",
  safeEvent.ending_message_ar || "وعاشوا بسعادة للأبد"
)}
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
