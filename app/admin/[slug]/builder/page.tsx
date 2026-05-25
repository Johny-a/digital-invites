"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InvitationPlayer from "@/app/components/InvitationPlayer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EventData = {
  id?: string;
ceremony_note?: string;
cover_image?: string;

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

after_place?: string;
after_time?: string;
after_map?: string;
after_note?: string;

groom_place?: string;
groom_place_ar?: string;
groom_map?: string;

bride_place?: string;
bride_place_ar?: string;
bride_map?: string;

houses_title?: string;
houses_title_ar?: string;

celebration_note?: string;
celebration_note_ar?: string;

parents_label_left_en?: string;
parents_label_left_ar?: string;
parents_label_right_en?: string;
parents_label_right_ar?: string;

after_place_ar?: string;
after_time_ar?: string;
after_note_ar?: string;
gift_note_ar?: string;

  ending_photo: string;

  bg_mode?: "video" | "slideshow";
  bg_images?: Record<string, string>;
  bg_video?: string;
  music_url?: string;

  hero_names: string;
hero_names_ar?: string;
hero_tagline_ar?: string;
hero_headline_ar?: string;

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

  date_text: string;
date_text_ar?: string;

time_text: string;
time_text_ar?: string;
  location_text: string;
event_date_iso?: string;

  ceremony_place: string;
  ceremony_time: string;
  ceremony_map: string;

  celebration_place: string;
  celebration_time: string;
  celebration_map: string;

celebration_note_bottom?: string;
celebration_note_bottom_ar?: string;

  // 👇 ADD THESE
  invitation_quote?: string;
  invitation_parents_left?: string;
  invitation_parents_right?: string;
  invitation_request_line?: string;

  gallery: string[];

  gifts: { label: string; value: string; logo?: string }[];
gift_note?: string;
  ending_message: string;

  template_id: string;
};

const EMPTY_EVENT: EventData = {
  hero_names: "",
  hero_tagline: "",
  hero_headline: "",
gift_note: "",
ceremony_note: "",
  bg_mode: "slideshow",
  bg_images: {},
  bg_video: "",
  music_url: "",
event_date_iso: "",
after_place: "",
after_time: "",
after_map: "",
after_note: "",

  ending_photo: "",

  date_text: "",
  time_text: "",
  location_text: "",

  ceremony_place: "",
  ceremony_time: "",
  ceremony_map: "",

  celebration_place: "",
  celebration_time: "",
  celebration_map: "",

  invitation_quote: "",
  invitation_parents_left: "",
  invitation_parents_right: "",
  invitation_request_line: "",

  gallery: [],
  gifts: [],
  ending_message: "",

  template_id: "classic",
};

const SLIDES = [
  "hero",
  "invitation",
  "houses", // ✅ ADD HERE
  "ceremony",
  "after",
  "celebration",
  "gifts",
  "rsvp",
  "photos",
  "ending",
  "media",
] as const;
const BG_SLIDES = [
  "hero",
  "invitation",
  "houses", 
  "ceremony",
  "after",
  "celebration",
  "gifts",
  "rsvp",
  "photos",
  "ending",
] as const;


type Tab = (typeof SLIDES)[number];

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("hero");
const [adminLang, setAdminLang] = useState<"en" | "ar">("en");
  const [previewSlide, setPreviewSlide] = useState(0);
  const [event, setEvent] = useState<EventData>(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
const [bgTarget, setBgTarget] = useState("hero");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !slug) return;

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("owner_user_id", user.id)
        .single();

      if (error || !data) {
        alert("Event not found or no access");
        router.replace("/admin");
        return;
      }

      setEvent({
        ...EMPTY_EVENT,
        ...data,
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        gifts: Array.isArray(data.gifts) ? data.gifts : [],
        template_id: data.template_id || "classic",
      });

      setLoading(false);
    };

    load();
  }, [mounted, slug, router]);

  const updateEvent = (patch: Partial<EventData>) => {
    setEvent((e) => ({ ...e, ...patch }));
    setDirty(true);
  };

const saveEvent = async () => {
  if (!event.id || saving) return;
  setSaving(true);

  const { id, ...rest } = event;

  const { error } = await supabase
    .from("events")
    .update({
      ...rest,
      cover_image: event.ending_photo,
    })
    .eq("id", id);

  setSaving(false);

  if (error) {
    console.error(error);
    alert("Save failed: " + error.message);
  } else {
    console.log("✅ SAVED TO DB", rest);
    setDirty(false);
    setLastSaved(new Date());
  }
};

  // Autosave
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(saveEvent, 3000);
    return () => clearTimeout(t);
  }, [dirty, event]);

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `${folder}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("event-images")
      .upload(fileName, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("event-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Drag & drop reorder photos
  const movePhoto = (from: number, to: number) => {
    const arr = [...(event.gallery || [])];
    const item = arr.splice(from, 1)[0];
    arr.splice(to, 0, item);
    updateEvent({ gallery: arr });
  };

  if (!mounted || loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 py-4 px-6 flex justify-between items-center">
        <span className="text-xl font-semibold">Invitation Builder</span>
        <div className="flex items-center gap-4 text-sm">
          {dirty ? (
            <span className="text-yellow-200">Unsaved changes</span>
          ) : lastSaved ? (
            <span className="text-green-200">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
          <button
            onClick={saveEvent}
            className="bg-white text-black px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
        {/* LEFT PANEL */}
        <div className="bg-[#111118] rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[85vh]">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
<div className="flex gap-2 mt-4">
  <button
    onClick={() => setAdminLang("en")}
    className={`px-3 py-1 rounded ${
      adminLang === "en" ? "bg-blue-600" : "bg-white/10"
    }`}
  >
    English
  </button>

  <button
    onClick={() => setAdminLang("ar")}
    className={`px-3 py-1 rounded ${
      adminLang === "ar" ? "bg-blue-600" : "bg-white/10"
    }`}
  >
    العربية
  </button>
</div>
            {SLIDES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setPreviewSlide(SLIDES.indexOf(t));
                }}
                className={`px-3 py-2 rounded ${
                  tab === t ? "bg-purple-600" : "bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* TEMPLATE */}
          <div>
            <div className="text-sm mb-1">Template</div>
            <select
              className="w-full bg-black/40 border rounded px-3 py-2"
              value={event.template_id}
              onChange={(e) => updateEvent({ template_id: e.target.value })}
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

{tab === "hero" && (
  <>
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Names (e.g. Joe & Dayane)"
value={
  adminLang === "ar"
    ? event.hero_names_ar || ""
    : event.hero_names || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { hero_names_ar: e.target.value }
      : { hero_names: e.target.value }
  )
}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Tagline (e.g. Together in Christ, Forever in Love)"
value={
  adminLang === "ar"
    ? event.hero_tagline_ar || ""
    : event.hero_tagline || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { hero_tagline_ar: e.target.value }
      : { hero_tagline: e.target.value }
  )
}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Headline (e.g. The wedding day has arrived!)"
value={
  adminLang === "ar"
    ? event.hero_headline_ar || ""
    : event.hero_headline || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { hero_headline_ar: e.target.value }
      : { hero_headline: e.target.value }
  )
}
    />
  </>
)}


          {/* INVITATION */}
          {tab === "invitation" && (
  <div className="space-y-3">

    {/* QUOTE */}
    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Quote (top text)"
      value={
        adminLang === "ar"
          ? event.invitation_quote_ar || ""
          : event.invitation_quote || ""
      }
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { invitation_quote_ar: e.target.value }
            : { invitation_quote: e.target.value }
        )
      }
    />

    {/* ✅ LEFT LABEL */}
<textarea
  rows={3}
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Left label (e.g. Mr & Mrs)"
      value={
        adminLang === "ar"
          ? event.parents_label_left_ar || ""
          : event.parents_label_left_en || ""
      }
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { parents_label_left_ar: e.target.value }
            : { parents_label_left_en: e.target.value }
        )
      }
    />

    {/* ✅ RIGHT LABEL */}
<textarea
  rows={3}
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Right label (e.g. Mr & Mrs)"
      value={
        adminLang === "ar"
          ? event.parents_label_right_ar || ""
          : event.parents_label_right_en || ""
      }
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { parents_label_right_ar: e.target.value }
            : { parents_label_right_en: e.target.value }
        )
      }
    />

{/* ✅ LEFT PARENTS NAMES */}
<textarea
  rows={4}
  className="w-full bg-black/40 border rounded px-4 py-2"
  placeholder="Left parents names"
  value={
    adminLang === "ar"
      ? event.invitation_parents_left_ar || ""
      : event.invitation_parents_left || ""
  }
  onChange={(e) =>
    updateEvent(
      adminLang === "ar"
        ? { invitation_parents_left_ar: e.target.value }
        : { invitation_parents_left: e.target.value }
    )
  }
/>

{/* ✅ RIGHT PARENTS NAMES */}
<textarea
  rows={4}
  className="w-full bg-black/40 border rounded px-4 py-2"
  placeholder="Right parents names"
  value={
    adminLang === "ar"
      ? event.invitation_parents_right_ar || ""
      : event.invitation_parents_right || ""
  }
  onChange={(e) =>
    updateEvent(
      adminLang === "ar"
        ? { invitation_parents_right_ar: e.target.value }
        : { invitation_parents_right: e.target.value }
    )
  }
/>

    {/* ✅ RIGHT PARENTS NAMES */}
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Right parents names"
      value={
        adminLang === "ar"
          ? event.invitation_parents_right_ar || ""
          : event.invitation_parents_right || ""
      }
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { invitation_parents_right_ar: e.target.value }
            : { invitation_parents_right: e.target.value }
        )
      }
    />

    {/* REQUEST LINE */}
    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Request line"
      value={
        adminLang === "ar"
          ? event.invitation_request_line_ar || ""
          : event.invitation_request_line || ""
      }
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { invitation_request_line_ar: e.target.value }
            : { invitation_request_line: e.target.value }
        )
      }
    />

    {/* DATE */}
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Date (e.g. 2026-04-26)"
      value={
        adminLang === "ar"
          ? event.date_text_ar || ""
          : event.date_text || ""
      }
      onChange={(e) => {
        const date = e.target.value;

        if (adminLang === "ar") {
          updateEvent({
            date_text_ar: date,
          });
        } else {
          const iso = `${date}T${event.time_text || "00:00"}`;
          updateEvent({
            date_text: date,
            event_date_iso: iso,
          });
        }
      }}
    />

    {/* TIME */}
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Time (e.g. 17:00)"
      value={
        adminLang === "ar"
          ? event.time_text_ar || ""
          : event.time_text || ""
      }
      onChange={(e) => {
        const time = e.target.value;

        if (adminLang === "ar") {
          updateEvent({
            time_text_ar: time,
          });
        } else {
          updateEvent({
            time_text: time,
            event_date_iso: `${event.date_text || ""}T${time}`,
          });
        }
      }}
    />

    {/* COUNTDOWN */}
    <label className="text-xs text-white/50">
      Countdown (exact date & time)
    </label>

    <input
      type="datetime-local"
      className="w-full bg-black/40 border rounded px-4 py-2"
      value={event.event_date_iso || ""}
      onChange={(e) =>
        updateEvent({
          event_date_iso: e.target.value,
        })
      }
    />

  </div>
)}

          {/* CEREMONY */}
          {tab === "ceremony" && (
  <>
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Place"
      value={
  adminLang === "ar"
    ? event.ceremony_place_ar || ""
    : event.ceremony_place
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { ceremony_place_ar: e.target.value }
      : { ceremony_place: e.target.value }
  )
}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Time"
value={
  adminLang === "ar"
    ? event.ceremony_time_ar || ""
    : event.ceremony_time
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { ceremony_time_ar: e.target.value }
      : { ceremony_time: e.target.value }
  )
}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Map link"
      value={event.ceremony_map}
      onChange={(e) => updateEvent({ ceremony_map: e.target.value })}
    />

    {/* ✅ NEW FIELD */}
    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Extra text under title (e.g. Dear family and friends...)"
value={
  adminLang === "ar"
    ? event.ceremony_note_ar || ""
    : event.ceremony_note || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { ceremony_note_ar: e.target.value }
      : { ceremony_note: e.target.value }
  )
}
    />
  </>
)}


{tab === "houses" && (
  <>
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Page Title"
      value={adminLang === "ar" ? event.houses_title_ar || "" : event.houses_title || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { houses_title_ar: e.target.value }
            : { houses_title: e.target.value }
        )
      }
    />

    {/* GROOM */}
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Groom Title"
      value={adminLang === "ar" ? event.groom_title_ar || "" : event.groom_title || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { groom_title_ar: e.target.value }
            : { groom_title: e.target.value }
        )
      }
    />

    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Groom Note"
      value={adminLang === "ar" ? event.groom_note_ar || "" : event.groom_note || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { groom_note_ar: e.target.value }
            : { groom_note: e.target.value }
        )
      }
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Groom Location"
      value={adminLang === "ar" ? event.groom_place_ar || "" : event.groom_place || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { groom_place_ar: e.target.value }
            : { groom_place: e.target.value }
        )
      }
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Groom Map"
      value={event.groom_map || ""}
      onChange={(e) => updateEvent({ groom_map: e.target.value })}
    />

    {/* BRIDE */}
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Bride Title"
      value={adminLang === "ar" ? event.bride_title_ar || "" : event.bride_title || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { bride_title_ar: e.target.value }
            : { bride_title: e.target.value }
        )
      }
    />

    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Bride Note"
      value={adminLang === "ar" ? event.bride_note_ar || "" : event.bride_note || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { bride_note_ar: e.target.value }
            : { bride_note: e.target.value }
        )
      }
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Bride Location"
      value={adminLang === "ar" ? event.bride_place_ar || "" : event.bride_place || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { bride_place_ar: e.target.value }
            : { bride_place: e.target.value }
        )
      }
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Bride Map"
      value={event.bride_map || ""}
      onChange={(e) => updateEvent({ bride_map: e.target.value })}
    />

    {/* FOOTER */}
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Bottom Text"
      value={adminLang === "ar" ? event.houses_footer_ar || "" : event.houses_footer || ""}
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { houses_footer_ar: e.target.value }
            : { houses_footer: e.target.value }
        )
      }
    />
  </>
)}


{tab === "after" && (
  <>
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="After Wedding Place"
value={
  adminLang === "ar"
    ? event.after_place_ar || ""
    : event.after_place || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { after_place_ar: e.target.value }
      : { after_place: e.target.value }
  )
}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="After Wedding Time"
value={
  adminLang === "ar"
    ? event.after_time_ar || ""
    : event.after_time || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { after_time_ar: e.target.value }
      : { after_time: e.target.value }
  )
}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Map link"
      value={event.after_map || ""}
      onChange={(e) => updateEvent({ after_map: e.target.value })}
    />

    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Note (text above location/time)"
value={
  adminLang === "ar"
    ? event.after_note_ar || ""
    : event.after_note || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { after_note_ar: e.target.value }
      : { after_note: e.target.value }
  )
}
    />
  </>
)}


{tab === "celebration" && (
  <>
    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Celebration Place"
      value={
        adminLang === "ar"
          ? event.celebration_place_ar || ""
          : event.celebration_place || ""
      }
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { celebration_place_ar: e.target.value }
            : { celebration_place: e.target.value }
        )
      }
    />
<textarea
  className="w-full bg-black/40 border rounded px-4 py-2"
  placeholder="Extra text under title (e.g. Join us for dinner...)"
  value={
    adminLang === "ar"
      ? event.celebration_note_ar || ""
      : event.celebration_note || ""
  }
  onChange={(e) =>
    updateEvent(
      adminLang === "ar"
        ? { celebration_note_ar: e.target.value }
        : { celebration_note: e.target.value }
    )
  }
/>

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Celebration Time"
      value={
        adminLang === "ar"
          ? event.celebration_time_ar || ""
          : event.celebration_time || ""
      }
      onChange={(e) =>
        updateEvent(
          adminLang === "ar"
            ? { celebration_time_ar: e.target.value }
            : { celebration_time: e.target.value }
        )
      }
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Map link"
      value={event.celebration_map || ""}
      onChange={(e) =>
        updateEvent({ celebration_map: e.target.value })
      }
    />
<textarea
  className="w-full bg-black/40 border rounded px-4 py-2"
  placeholder="Bottom note (shown under map)"
  value={
    adminLang === "ar"
      ? event.celebration_note_bottom_ar || ""
      : event.celebration_note_bottom || ""
  }
  onChange={(e) =>
    updateEvent(
      adminLang === "ar"
        ? { celebration_note_bottom_ar: e.target.value }
        : { celebration_note_bottom: e.target.value }
    )
  }
/>
  </>
)}



          {/* MEDIA */}
{tab === "media" && (
  <div className="space-y-4">
    <div>
      <label className="text-sm">Background Mode</label>
      <select
        className="w-full bg-black/40 border rounded px-3 py-2"
        value={event.bg_mode || "slideshow"}
        onChange={(e) => updateEvent({ bg_mode: e.target.value as any })}
      >
        <option value="slideshow">Slideshow (Images)</option>
        <option value="video">Video</option>
      </select>
    </div>

    {/* Upload video */}
    <div>
      <label className="text-sm">Background Video</label>
      <input
        type="file"
        accept="video/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const url = await uploadFile(f, "bg-video");
          updateEvent({ bg_video: url });
        }}
      />
    </div>

    {/* Upload images */}
    <div>
      <label className="text-sm">
  <select
  className="w-full bg-black/40 border rounded px-3 py-2"
value={bgTarget}
onChange={(e) => setBgTarget(e.target.value)}
>
  {BG_SLIDES.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>

{!BG_SLIDES.includes(bgTarget as any) && (
  <span className="text-red-400 text-xs ml-2">(no background)</span>
)}
</label>
      <input
        type="file"
        accept="image/*"
onChange={async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;

  const url = await uploadFile(f, "bg-image");

  const newImages = {
  ...(event.bg_images || {}),
  [bgTarget]: url,
};

updateEvent({ bg_images: newImages });
}}
      />
    </div>

    <div className="grid grid-cols-3 gap-2">
      {Object.entries(event.bg_images || {}).map(([key, img]) => (
  <div key={key} className="relative group">
    {img && (
  <img src={img} className="h-20 w-full object-cover rounded" />
)}

    <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1 rounded">
      {key}
    </div>

    <button
      className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
      onClick={() => {
        const copy = { ...(event.bg_images || {}) };
        delete copy[key];
        updateEvent({ bg_images: copy });
      }}
    >
      ✕
    </button>
  </div>
))}
</div> 
    {/* Music */}
    <div>
      <label className="text-sm">Background Music</label>
      <input
        type="file"
        accept="audio/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const url = await uploadFile(f, "music");
          updateEvent({ music_url: url });
        }}
      />
    </div>
  </div>
)}

          {/* PHOTOS */}
          {tab === "photos" && (
  <>
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = await uploadFile(f, "gallery");
        updateEvent({ gallery: [...(event.gallery || []), url] });
      }}
    />

    <div className="grid grid-cols-3 gap-2">
      {(event.gallery || []).map((img, i) => (
        <div key={i} className="relative group">
          <img src={img} className="h-24 w-full object-cover rounded" />

          {/* Delete button */}
          <button
            onClick={() => {
              const arr = (event.gallery || []).filter((_, idx) => idx !== i);
              updateEvent({ gallery: arr });
            }}
            className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </>
)}


          {/* GIFTS */}
{tab === "gifts" && (
  <div className="space-y-4">

    {/* ✅ MESSAGE (TOP - FULL WIDTH) */}
    <div className="space-y-2">
      <label className="text-sm text-white/70">
        Gift Section Message
      </label>

      <textarea
        rows={3}
        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500"
        placeholder="e.g. Please confirm your attendance before 10 April 2026 using your invitation code"
        value={
  adminLang === "ar"
    ? event.gift_note_ar || ""
    : event.gift_note || ""
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { gift_note_ar: e.target.value }
      : { gift_note: e.target.value }
  )
}
      />

      <p className="text-xs text-white/40">
        This text appears under the gift message
      </p>
    </div>

    {/* ✅ GIFT METHODS */}
    {(event.gifts || []).map((g, i) => (
    <div key={i} className="flex flex-col gap-2 border border-white/10 p-3 rounded-lg">
 {/* Method + Value row */}
<div className="flex gap-2">
  <input
    className="flex-1 bg-black/40 border rounded px-3 py-2"
    placeholder="Method (e.g. Whish)"
    value={g.label}
    onChange={(e) => {
      const arr = [...event.gifts];
      arr[i].label = e.target.value;
      updateEvent({ gifts: arr });
    }}
  />

  <input
    className="flex-1 bg-black/40 border rounded px-3 py-2"
    placeholder="Account / Number"
    value={g.value}
    onChange={(e) => {
      const arr = [...event.gifts];
      arr[i].value = e.target.value;
      updateEvent({ gifts: arr });
    }}
  />

  <button
    className="px-3 border border-white/30 rounded"
    onClick={() => {
      const arr = event.gifts.filter((_, idx) => idx !== i);
      updateEvent({ gifts: arr });
    }}
  >
    ✕
  </button>
</div>

{/* ✅ LOGO UPLOAD */}
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const url = await uploadFile(f, "gift-logo");

    const arr = [...event.gifts];
    arr[i] = { ...arr[i], logo: url };
    updateEvent({ gifts: arr });
  }}
/>

{/* Preview logo */}
{g.logo && (
  <img
    src={g.logo}
    alt="logo"
    className="w-10 h-10 object-contain mt-1"
  />
)}

      </div>
    ))}

    {/* ADD BUTTON */}
    <button
      className="w-full py-2 border border-white/30 rounded"
      onClick={() =>
        updateEvent({
          gifts: [...event.gifts, { label: "", value: "" }],
        })
      }
    >
      + Add Gift Method
    </button>

  </div>
)}

          {/* ENDING */}
{tab === "ending" && (
  <div className="space-y-3">
    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Ending message"
      value={
  adminLang === "ar"
    ? event.ending_message_ar || ""
    : event.ending_message
}
onChange={(e) =>
  updateEvent(
    adminLang === "ar"
      ? { ending_message_ar: e.target.value }
      : { ending_message: e.target.value }
  )
}
    />

    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = await uploadFile(f, "ending");
        updateEvent({ ending_photo: url });
      }}
    />

    {event.ending_photo && (
      <button
        className="text-red-400 text-sm underline"
        onClick={() => updateEvent({ ending_photo: "" })}
      >
        Remove photo
      </button>
    )}
  </div>
)}

        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex justify-center">
          <div className="relative bg-black rounded-[2rem] overflow-hidden aspect-[9/16] max-h-[80vh] w-full max-w-[360px] shadow-2xl border border-white/10">
            <InvitationPlayer
  event={event}
  templateId={event.template_id}
  editorMode
  forcedPage={previewSlide}
  language={adminLang}
/>
          </div>
        </div>
      </div>
    </div>
  );
}
