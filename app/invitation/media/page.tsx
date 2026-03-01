"use client";

import { useState } from "react";
import InvitationPlayer from "@/app/components/InvitationPlayer";

type Tab =
  | "personal"
  | "event"
  | "ceremony"
  | "gift"
  | "media"
  | "ending";

export default function InvitationMediaPage() {
  const [tab, setTab] = useState<Tab>("personal");

  const [eventData, setEventData] = useState<any>({
    title: "Sarah & Mike",
    message: "We are getting married",
    date: "September 21, 2026",
    location: "Beirut, Lebanon",
    cover_video_url: "/demo/demo-video.mp4",
    music_url: "/demo/demo-music.mp3",
    image_urls: ["/demo/demo1.jpg", "/demo/demo2.jpg", "/demo/demo3.jpg"],
    endingText: "Happily ever after 💍",
  });

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-10 py-6">
        <h1 className="text-3xl font-semibold">Step 3: Customize Your Invitation</h1>
        <p className="text-white/60">
          Fine-tune every detail with live preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-96px)]">
        {/* LEFT: Editor */}
        <div className="p-8 overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {[
              ["personal", "Personal"],
              ["event", "Event"],
              ["ceremony", "Ceremony & Venue"],
              ["gift", "Gift"],
              ["media", "Media"],
              ["ending", "Ending"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key as Tab)}
                className={`px-5 py-2 rounded-full text-sm transition ${
                  tab === key
                    ? "bg-purple-600 text-white shadow"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            {tab === "personal" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Couple Details</h2>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                  placeholder="Title (e.g. Sarah & Mike)"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                  placeholder="Quote / Message"
                  value={eventData.message}
                  onChange={(e) =>
                    setEventData({ ...eventData, message: e.target.value })
                  }
                />
              </div>
            )}

            {tab === "event" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Event Details</h2>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                  placeholder="Date"
                  value={eventData.date}
                  onChange={(e) =>
                    setEventData({ ...eventData, date: e.target.value })
                  }
                />
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                  placeholder="Location"
                  value={eventData.location}
                  onChange={(e) =>
                    setEventData({ ...eventData, location: e.target.value })
                  }
                />
              </div>
            )}

            {tab === "ceremony" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Ceremony & Venue</h2>
                <p className="text-white/60 text-sm">
                  (You can expand this later with maps, times, etc.)
                </p>
              </div>
            )}

            {tab === "gift" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Gift Registry</h2>
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                  placeholder="Gift message"
                />
              </div>
            )}

            {tab === "media" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Media</h2>
                <p className="text-white/60 text-sm">
                  (Next step: upload images, video, music)
                </p>
              </div>
            )}

            {tab === "ending" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Ending Screen</h2>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3"
                  placeholder="Ending text"
                  value={eventData.endingText}
                  onChange={(e) =>
                    setEventData({ ...eventData, endingText: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="relative bg-black flex items-center justify-center">
          <div className="w-[360px] h-[720px] rounded-[40px] overflow-hidden shadow-2xl border border-white/20">
            <InvitationPlayer event={eventData} templateId="classic-01" />
          </div>
        </div>
      </div>
    </div>
  );
}
