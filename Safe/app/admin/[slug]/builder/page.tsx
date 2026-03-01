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

ending_photo: string;

bg_mode?: "video" | "slideshow";
bg_images?: string[];
bg_video?: string;
music_url?: string;


  hero_names: string;
  hero_tagline: string;
  hero_headline: string;

  date_text: string;
  time_text: string;
  location_text: string;

  ceremony_place: string;
  ceremony_time: string;
  ceremony_map: string;

  celebration_place: string;
  celebration_time: string;
  celebration_map: string;

  video_url: string;
  music_url: string;

  gallery: string[];

  gifts: { label: string; value: string }[];
  ending_message: string;

  template_id: string;
};

const EMPTY_EVENT: EventData = {
  hero_names: "",
  hero_tagline: "",
  hero_headline: "",

bg_mode: "slideshow",
bg_images: [],
bg_video: "",
music_url: "",


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

  video_url: "",
  music_url: "",

  gallery: [],

  gifts: [],
  ending_message: "",

  template_id: "classic",
};


const SLIDES = [
  "hero",
  "invitation",
  "ceremony",
  "celebration",
  "rsvp",
  "photos",
  "gifts",
  "ending",
  "media",
] as const;

type Tab = (typeof SLIDES)[number];

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("hero");
  const [previewSlide, setPreviewSlide] = useState(0);
  const [event, setEvent] = useState<EventData>(EMPTY_EVENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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

    const { error } = await supabase
      .from("events")
      .update(event)
      .eq("id", event.id);

    setSaving(false);

    if (error) {
      alert("Save failed: " + error.message);
    } else {
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
      value={event.hero_names || ""}
      onChange={(e) => updateEvent({ hero_names: e.target.value })}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Tagline (e.g. Together in Christ, Forever in Love)"
      value={event.hero_tagline || ""}
      onChange={(e) => updateEvent({ hero_tagline: e.target.value })}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Headline (e.g. The wedding day has arrived!)"
      value={event.hero_headline || ""}
      onChange={(e) => updateEvent({ hero_headline: e.target.value })}
    />
  </>
)}


          {/* INVITATION */}
          {tab === "invitation" && (
  <div className="space-y-3">
    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Quote (top text)"
      value={event.invitation_quote || ""}
      onChange={(e) => updateEvent({ invitation_quote: e.target.value })}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Left parents block"
      value={event.invitation_parents_left || ""}
      onChange={(e) => updateEvent({ invitation_parents_left: e.target.value })}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Right parents block"
      value={event.invitation_parents_right || ""}
      onChange={(e) => updateEvent({ invitation_parents_right: e.target.value })}
    />

    <textarea
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Request line"
      value={event.invitation_request_line || ""}
      onChange={(e) => updateEvent({ invitation_request_line: e.target.value })}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Date (e.g. Saturday, July 5th, 2025)"
      value={event.date_text || ""}
      onChange={(e) => updateEvent({ date_text: e.target.value })}
    />

    <input
      className="w-full bg-black/40 border rounded px-4 py-2"
      placeholder="Time (e.g. 5:30 PM)"
      value={event.time_text || ""}
      onChange={(e) => updateEvent({ time_text: e.target.value })}
    />
  </div>
)}


          {/* CEREMONY */}
          {tab === "ceremony" && (
            <>
              <input className="w-full bg-black/40 border rounded px-4 py-2" placeholder="Place"
                value={event.ceremony_place} onChange={(e) => updateEvent({ ceremony_place: e.target.value })} />
              <input className="w-full bg-black/40 border rounded px-4 py-2" placeholder="Time"
                value={event.ceremony_time} onChange={(e) => updateEvent({ ceremony_time: e.target.value })} />
              <input className="w-full bg-black/40 border rounded px-4 py-2" placeholder="Map link"
                value={event.ceremony_map} onChange={(e) => updateEvent({ ceremony_map: e.target.value })} />
            </>
          )}

          {/* CELEBRATION */}
          {tab === "celebration" && (
            <>
              <input className="w-full bg-black/40 border rounded px-4 py-2" placeholder="Place"
                value={event.celebration_place} onChange={(e) => updateEvent({ celebration_place: e.target.value })} />
              <input className="w-full bg-black/40 border rounded px-4 py-2" placeholder="Time"
                value={event.celebration_time} onChange={(e) => updateEvent({ celebration_time: e.target.value })} />
              <input className="w-full bg-black/40 border rounded px-4 py-2" placeholder="Map link"
                value={event.celebration_map} onChange={(e) => updateEvent({ celebration_map: e.target.value })} />
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
      <label className="text-sm">Background Images (slideshow)</label>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const url = await uploadFile(f, "bg-image");
          updateEvent({ bg_images: [...(event.bg_images || []), url] });
        }}
      />
    </div>

    <div className="grid grid-cols-3 gap-2">
      {(event.bg_images || []).map((img, i) => (
        <div key={i} className="relative group">
          <img src={img} className="h-20 w-full object-cover rounded" />
          <button
            className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
            onClick={() => {
              const arr = (event.bg_images || []).filter((_, idx) => idx !== i);
              updateEvent({ bg_images: arr });
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
  <div className="space-y-3">
    {(event.gifts || []).map((g, i) => (
      <div key={i} className="flex gap-2">
        <input
          className="flex-1 bg-black/40 border rounded px-3 py-2"
          placeholder="Method (e.g. WHISH, Bank, OMT)"
          value={g.label}
          onChange={(e) => {
            const arr = [...(event.gifts || [])];
            arr[i] = { ...arr[i], label: e.target.value };
            updateEvent({ gifts: arr });
          }}
        />

        <input
          className="flex-1 bg-black/40 border rounded px-3 py-2"
          placeholder="Account / Info"
          value={g.value}
          onChange={(e) => {
            const arr = [...(event.gifts || [])];
            arr[i] = { ...arr[i], value: e.target.value };
            updateEvent({ gifts: arr });
          }}
        />

        <button
          className="px-3 border border-white/30 rounded"
          onClick={() => {
            const arr = (event.gifts || []).filter((_, idx) => idx !== i);
            updateEvent({ gifts: arr });
          }}
        >
          ✕
        </button>
      </div>
    ))}

    <button
      className="w-full py-2 border border-white/30 rounded"
      onClick={() =>
        updateEvent({
          gifts: [...(event.gifts || []), { label: "", value: "" }],
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
      value={event.ending_message}
      onChange={(e) => updateEvent({ ending_message: e.target.value })}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
