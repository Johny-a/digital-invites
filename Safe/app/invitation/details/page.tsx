"use client";

import { useState } from "react";
import InvitationPlayer from "@/app/components/InvitationPlayer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type GiftItem = { title: string; value: string };

type EventData = {
  title: string;
  message: string;
  date: string;
  location: string;
  ceremony_place: string;
  ceremony_time: string;
  ceremony_map: string;
  party_place: string;
  party_time: string;
  party_map: string;
  cover_video_url?: string;
  music_url?: string;
  image_urls: string[];
  gifts: GiftItem[];
  ending_message: string;
};

const TABS = [
  "hero",
  "invitation",
  "locations",
  "gallery",
  "gifts",
  "rsvp",
  "ending",
] as const;

const SLIDES = [
  "hero",
  "invitation",
  "locations",
  "gallery",
  "gifts",
  "rsvp",
  "ending",
] as const;


type Tab = (typeof TABS)[number];

export default function InvitationDetailsPage() {
  const [tab, setTab] = useState<Tab>("hero");
  const [previewSlide, setPreviewSlide] = useState(0);
  const [templateId, setTemplateId] = useState("classic-01");

  const [event, setEvent] = useState<EventData>({
    title: "Chris & Karen",
    message: "Together in Christ, Forever in Love",
    date: "September 21, 2026",
    location: "Beirut, Lebanon",
    ceremony_place: "Patriarchal Residence",
    ceremony_time: "5:30 PM",
    ceremony_map: "",
    party_place: "Plaza Palace",
    party_time: "7:00 PM",
    party_map: "",
    cover_video_url: "",
    music_url: "",
    image_urls: [],
    gifts: [],
    ending_message: "We can’t wait to celebrate with you ❤️",
  });

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

const goTab = (t: Tab) => {
  setTab(t);

  // Only change preview slide if this tab is a real slide
  const slideIndex = SLIDES.indexOf(t as any);
  if (slideIndex !== -1) {
    setPreviewSlide(slideIndex);
  }
};

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 py-6 text-center text-2xl font-semibold">
        Invitation Builder
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
        {/* LEFT */}
        <div className="bg-[#111118] rounded-2xl shadow-xl p-6">
          <select
            className="w-full bg-black/40 border rounded px-3 py-2 mb-4"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            <option value="classic-01">Classic</option>
            <option value="modern-01">Modern</option>
            <option value="minimal-01">Minimal</option>
          </select>

<div className="flex gap-2 flex-wrap mb-6">
  {[...SLIDES, "media"].map((t) => (
    <button
      key={t}
      onClick={() => goTab(t as Tab)}
      className={`px-4 py-2 rounded-full text-sm ${
        tab === t ? "bg-purple-600" : "bg-white/10"
      }`}
    >
      {t}
    </button>
  ))}
</div>

          {/* HERO */}
          {tab === "hero" && (
            <div className="space-y-3">
              <input
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
              />
              <input
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.message}
                onChange={(e) => setEvent({ ...event, message: e.target.value })}
              />
            </div>
          )}

          {/* INVITATION */}
          {tab === "invitation" && (
            <div className="space-y-3">
              <input
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
              />
              <input
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
              />
            </div>
          )}

          {/* LOCATIONS */}
          {tab === "locations" && (
            <div className="space-y-3">
              <input
                placeholder="Ceremony Place"
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.ceremony_place}
                onChange={(e) =>
                  setEvent({ ...event, ceremony_place: e.target.value })
                }
              />
              <input
                placeholder="Ceremony Time"
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.ceremony_time}
                onChange={(e) =>
                  setEvent({ ...event, ceremony_time: e.target.value })
                }
              />
              <input
                placeholder="Ceremony Map Link"
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.ceremony_map}
                onChange={(e) =>
                  setEvent({ ...event, ceremony_map: e.target.value })
                }
              />
              <input
                placeholder="Party Place"
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.party_place}
                onChange={(e) =>
                  setEvent({ ...event, party_place: e.target.value })
                }
              />
              <input
                placeholder="Party Time"
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.party_time}
                onChange={(e) =>
                  setEvent({ ...event, party_time: e.target.value })
                }
              />
              <input
                placeholder="Party Map Link"
                className="w-full bg-black/40 border rounded px-4 py-2"
                value={event.party_map}
                onChange={(e) =>
                  setEvent({ ...event, party_map: e.target.value })
                }
              />
            </div>
          )}

          {/* MEDIA */}
          {tab === "media" && (
            <div className="space-y-4">
              <input
                type="file"
                accept="video/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadFile(f, "video");
                  setEvent((p) => ({ ...p, cover_video_url: url }));
                }}
              />
              <input
                type="file"
                accept="audio/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadFile(f, "music");
                  setEvent((p) => ({ ...p, music_url: url }));
                }}
              />
            </div>
          )}

          {/* GALLERY */}
          {tab === "gallery" && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadFile(f, "gallery");
                  setEvent((p) => ({ ...p, image_urls: [...p.image_urls, url] }));
                }}
              />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {event.image_urls.map((img, i) => (
                  <img key={i} src={img} className="w-full h-24 object-cover" />
                ))}
              </div>
            </div>
          )}

          {/* GIFTS */}
          {tab === "gifts" && (
            <div>
              <button
                className="bg-yellow-500 text-black px-4 py-2 rounded mb-3"
                onClick={() =>
                  setEvent((p) => ({
                    ...p,
                    gifts: [...p.gifts, { title: "Gift", value: "Details" }],
                  }))
                }
              >
                + Add Gift
              </button>
              {event.gifts.map((g, i) => (
                <div key={i} className="space-y-2 mb-3">
                  <input
                    className="w-full bg-black/40 border rounded px-3 py-2"
                    value={g.title}
                    onChange={(e) => {
                      const gifts = [...event.gifts];
                      gifts[i].title = e.target.value;
                      setEvent({ ...event, gifts });
                    }}
                  />
                  <input
                    className="w-full bg-black/40 border rounded px-3 py-2"
                    value={g.value}
                    onChange={(e) => {
                      const gifts = [...event.gifts];
                      gifts[i].value = e.target.value;
                      setEvent({ ...event, gifts });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ENDING */}
          {tab === "ending" && (
            <textarea
              className="w-full bg-black/40 border rounded px-4 py-3"
              value={event.ending_message}
              onChange={(e) =>
                setEvent({ ...event, ending_message: e.target.value })
              }
            />
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex justify-center">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-[9/16] max-h-[80vh] w-full max-w-[360px]">
            <InvitationPlayer
              event={event}
              templateId={templateId}
              editorMode={true}
              forcedPage={previewSlide}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
