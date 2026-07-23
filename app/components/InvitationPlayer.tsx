"use client";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import FloralTemplate from "./templates/floral/FloralTemplate";
import MinimalistTemplate from "./templates/minimalist/MinimalistTemplate";
import ThemeProvider from "@/app/components/design/ThemeProvider";
import OpeningOverlay from "@/app/components/opening/OpeningOverlay";

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
cover_image?: string;
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
// MAX GUESTS FROM URL
const searchParams =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;

const invParam = searchParams?.get("inv");

const maxInvites = invParam ? Number(invParam) : null;
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
const [opening, setOpening] = useState(false);
const [showOverlay, setShowOverlay] = useState(!editorMode);
const [muted, setMuted] = useState(editorMode ? true : false);
const wasPlayingRef = useRef(false);
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

if (safeEvent.cover_image) {
    tasks.push(loadImage(getOptimizedSrc(safeEvent.cover_image)));
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

    setError(null);

    // Name

    if (!mainName.trim()) {

        setError("Please enter your name.");

        return;

    }

    // Attendance

    if (attending === null) {

        setError("Please choose whether you will attend.");

        return;

    }

    // Guest count (ONLY if attending)

    if (attending) {

        const guests = Number(normalizeNumber(String(guestCount)));

        if (!guests || guests < 1) {

            setError("Please select the number of guests.");

            return;

        }

        if (maxInvites && guests > maxInvites) {

            setError(`Maximum allowed guests is ${maxInvites}.`);

            return;

        }

    }

    setSending(true);

    const { error: dbError } = await supabase
        .from("rsvps")
        .insert({

            event_id: event.id,

            main_name: mainName.trim(),

            guest_count:
                attending
                    ? Number(normalizeNumber(String(guestCount)))
                    : 0,

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


const handleOpenInvitation = async () => {

    setOpening(true);

    try {

        setTimeout(async () => {
    if (audioRef.current) {
        try {
            await audioRef.current.play();
        } catch (e) {
            console.error(e);
        }
    }
}, 2100);

setTimeout(() => {
    setStarted(true);
}, 2100);

setTimeout(() => {
    setShowOverlay(false);
}, 2600);

    } catch (e) {
        console.error(e);
    }

};

    
const templateProps = {
  safeEvent,
  language,
  started,
  muted,
  page,
  fade,
  gallery,
  current,
  timeLeft,
  template,
  editorMode,
  audioRef,
  videoRef,
  SLIDES,

  heroNames,
  getText,
  t,

  assetsReady,
  progressPercent,
  firstBgLoaded,

  setLanguage,
  setStarted,
  setMuted,
  wasPlayingRef,

  mainName,
  setMainName,
  guestCount,
  setGuestCount,

  attending,
  setAttending,

  note,
  setNote,

  sending,
  sent,
  error,

  maxInvites,
  normalizeNumber,

  photoIndex,
  setPhotoIndex,
  photoOffset,
  isDragging,

  onPhotoTouchStart,
  onPhotoTouchMove,
  onPhotoTouchEnd,

  changePage,
  submitRSVP,
};



return (
    <>
        <audio
            ref={audioRef}
            src={safeEvent.music_url}
            loop
            preload="auto"
            playsInline
        />

        <ThemeProvider event={safeEvent}>
            <MinimalistTemplate
                {...templateProps}
            />
        </ThemeProvider>

        {showOverlay && (
            <OpeningOverlay
                coverImage={
                    safeEvent.cover_image ||
                    safeEvent.ending_photo ||
                    Object.values(safeEvent.bg_images || {})[0] ||
                    ""
                }
                names={heroNames}
                tagline={safeEvent.hero_tagline}
                opening={opening}
                onOpen={handleOpenInvitation}
            />
        )}
    </>
);

}
