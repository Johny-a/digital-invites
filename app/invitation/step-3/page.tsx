"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import InvitationPlayer from "@/app/components/InvitationPlayer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Step3LuxuryPage() {
  const router = useRouter();

  // Basic info
  const [slug, setSlug] = useState("sarah-and-mike");
  const [title, setTitle] = useState("Our Wedding");
  const [message, setMessage] = useState("We are getting married");
  const [date, setDate] = useState("2026-09-21");
  const [location, setLocation] = useState("Beirut, Lebanon");

  // Media
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // RSVP
  const [enableRSVP, setEnableRSVP] = useState(true);
  const [maxGuests, setMaxGuests] = useState(2);

  // UI
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  // Preview URLs
  const galleryPreviews = useMemo(
    () => galleryFiles.map((f) => URL.createObjectURL(f)),
    [galleryFiles]
  );

  const videoPreview = useMemo(
    () => (videoFile ? URL.createObjectURL(videoFile) : null),
    [videoFile]
  );

  // Live preview event object
  const previewEvent = {
    title,
    message,
    date,
    location,
    cover_video_url: videoPreview || "/demo/demo-video.mp4",
    music_url: "/demo/demo-music.mp3",
    image_urls: galleryPreviews,
    rsvp_enabled: enableRSVP,
    rsvp_max_guests: maxGuests,
  };

  const publish = async () => {
    if (!slug) {
      setError("Please choose a link for your invitation");
      return;
    }

    setPublishing(true);
    setError("");

    // NOTE: For now we save preview URLs or empty.
    // Next step we can wire real Supabase Storage uploads cleanly.
    const { error: insertError } = await supabase.from("events").insert({
      slug: slug.toLowerCase(),
      template_id: "default",
      title,
      message,
      date,
      location,
      music_url: previewEvent.music_url,
      background_video_url: previewEvent.cover_video_url,
      image_urls: JSON.stringify(previewEvent.image_urls || []),
      rsvp_enabled: enableRSVP,
      rsvp_max_guests: maxGuests,
    });

    if (insertError) {
      setError("Failed to publish: " + insertError.message);
      setPublishing(false);
      return;
    }

    router.push(`/admin/${slug.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm opacity-80 mb-2">
            Step 1 → Step 2 → <span className="font-semibold">Step 3</span>
          </p>
          <h1 className="text-4xl font-semibold mb-2">
            Customize Your Invitation
          </h1>
          <p className="opacity-90">
            Fine-tune every detail and preview your invitation live
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: Forms */}
        <div className="space-y-8">
          {/* Card: Couple & Message */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Couple & Message</h2>
            <div className="space-y-4">
              <input
                className="w-full p-3 rounded-lg border"
                placeholder="Title (e.g. Our Wedding)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full p-3 rounded-lg border min-h-[100px]"
                placeholder="Message to your guests"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Card: Event Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full p-3 rounded-lg border"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-lg border"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Card: Gallery */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {galleryPreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-full h-24 object-cover rounded-lg"
                    alt="preview"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Card: Video */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Background Video</h2>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideoFile(e.target.files ? e.target.files[0] : null)
              }
            />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="mt-4 w-full rounded-lg"
              />
            )}
          </div>

          {/* Card: RSVP */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">RSVP Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enableRSVP}
                  onChange={(e) => setEnableRSVP(e.target.checked)}
                />
                Enable RSVP
              </label>

              {enableRSVP && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Max guests per invitation
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 rounded-lg border"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Card: Publish */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Publish Settings</h2>
            <input
              className="w-full p-3 rounded-lg border"
              placeholder="your-invitation-link"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">
              Your link will be: yoursite.com/{slug || "your-name"}
            </p>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <button
              onClick={publish}
              disabled={publishing}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition"
            >
              {publishing ? "Publishing..." : "✨ Publish Invitation"}
            </button>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="flex items-start justify-center">
          <div className="sticky top-10">
            <div className="w-[340px] h-[680px] rounded-[42px] bg-black shadow-2xl p-3">
              <div className="w-full h-full rounded-[34px] overflow-hidden bg-black">
                <InvitationPlayer event={previewEvent as any} templateId="demo" />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Live Preview
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
