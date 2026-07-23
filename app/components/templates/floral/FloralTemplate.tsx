"use client";
const isMobile =
  typeof window !== "undefined" && window.innerWidth < 768;

const getOptimizedSrc = (src: string) =>
  isMobile
    ? `${src}?width=600&quality=50`
    : `${src}?width=1200&quality=70`;

export default function FloralTemplate(props: any) {
const {
  language,
  safeEvent,
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

  touchStartX,

  changePage,
  submitRSVP,
} = props;

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
wasPlayingRef.current = true;

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
  className={`text-white/95 max-w-[280px] mx-auto ${
  language === "ar"
    ? "text-lg md:text-xl font-[Amiri] italic"
    : "text-sm md:text-base font-serif italic font-bold leading-[1.8] tracking-[0.02em]"
}`}
>
  {getText(safeEvent.invitation_quote, safeEvent.invitation_quote_ar)}
</p>

    {/* Parents */}
<div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-2xl mx-auto">

  {/* LEFT */}
<div className="flex flex-col items-center text-center gap-1">

  {/* LABEL */}


  <div
  className={`h-auto min-w-0 w-full flex items-center justify-center text-center px-3 ${
    language === "ar"
      ? "text-lg font-[Amiri] font-bold text-white tracking-normal"
      : "text-lg font-serif font-black uppercase tracking-[0.2em] text-white"
  }`}
>
  {getText(
    safeEvent.parents_label_left_en || "Mr & Mrs",
    safeEvent.parents_label_left_ar || "السيد والسيدة"
  )}
</div>

  {/* NAMES */}
  <div className="text-xl font-semibold whitespace-pre-line text-white">
    {getText(
      safeEvent.invitation_parents_left,
      safeEvent.invitation_parents_left_ar
    )}
  </div>
</div>

{/* RIGHT */}
<div className="flex flex-col items-center text-center gap-1">

  {/* LABEL */}

<div
  className={`h-auto min-w-0 w-full flex items-center justify-center text-center px-3 ${
    language === "ar"
      ? "text-lg font-[Amiri] font-bold text-white tracking-normal"
      : "text-lg font-serif font-black uppercase tracking-[0.2em] text-white"
  }`}
>
  {getText(
    safeEvent.parents_label_right_en || "Family Of",
    safeEvent.parents_label_right_ar || "السيد والسيدة"
  )}
</div>

  {/* NAMES */}
  <div className="text-xl font-semibold whitespace-pre-line text-white">
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
  <div className="w-full h-full flex flex-col items-center justify-center text-center px-4 space-y-2">

    {/* TITLE */}
    <h2 className={`text-2xl md:text-3xl ${
      language === "ar" ? "font-[Amiri]" : "font-serif"
    }`}>
      {getText(
        safeEvent.houses_title || "Before the Ceremony",
        safeEvent.houses_title_ar || "قبل المراسم"
      )}
    </h2>

    {/* HOUSES */}
    <div className="flex flex-col gap-3 w-full max-w-sm">

      {/* GROOM */}
      {safeEvent.groom_place && (
        <div className="space-y-1 border border-white/20 rounded-xl p-3 bg-black/30 max-h-[28vh] overflow-hidden">

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
        <div className="space-y-2 border border-white/20 rounded-xl p-3 bg-black/30 max-h-[28vh] overflow-hidden">

          <h3 className="text-base font-semibold">
            {getText(
              safeEvent.bride_title || "The Bride’s House",
              safeEvent.bride_title_ar || "منزل العروس"
            )}
          </h3>

          <p className="text-white/70 text-xs">
            {getText(
              safeEvent.bride_note || "Join us at the bride’s home where beautiful moments begin.",
              safeEvent.bride_note_ar || "ندعوكم لمشاركتنا اللحظات الجميلة في منزل العروس"
            )}
          </p>

          <div className="text-sm">
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

  {/* LIMITED MODE → SELECT */}
  {maxInvites ? (
    <select
      className="w-full bg-black/40 border border-white/30 rounded px-3 py-2"
      value={guestCount}
      onChange={(e) => setGuestCount(Number(e.target.value))}
    >
      <option value="">
        {language === "ar"
          ? "اختر عدد الضيوف"
          : "Select number of guests"}
      </option>

      {Array.from({ length: maxInvites }, (_, i) => i + 1).map((num) => (
        <option key={num} value={num}>
          {language === "ar"
            ? `${num} ضيف`
            : `${num} Guest${num > 1 ? "s" : ""}`}
        </option>
      ))}
    </select>
  ) : (
    /* UNLIMITED MODE → INPUT */
    <input
      type="text"
      inputMode="numeric"
      min="1"
      className="w-full bg-black/40 border border-white/30 rounded px-3 py-2 appearance-none"
      value={guestCount}
      placeholder={
        language === "ar"
          ? "أدخل عدد الضيوف"
          : "Enter number of guests"
      }
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
  )}
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
  {gallery.map((img: string, i: number) => (
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
          {gallery.map((_: string, i: number) => (
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

  {safeEvent.gifts?.map((g: any, i: number) => (
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

  wasPlayingRef.current = !next; // 👈 IMPORTANT

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