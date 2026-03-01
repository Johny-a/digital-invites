"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Mode = "image" | "video";
type Category = "floral" | "minimalist" | "romance" | "classic";

type TemplateItem = {
  id: string;
  thumb: string;
  video?: string;
  tag?: "NEW" | "PREMIUM";
};

const TEMPLATES: {
  wedding: {
    image: Record<Category, TemplateItem[]>;
    video: Record<Category, TemplateItem[]>;
  };
} = {
  wedding: {
    image: {
      floral: [
        { id: "floral-01", thumb: "/templates/floral-01.jpg", tag: "PREMIUM" },
        { id: "floral-02", thumb: "/templates/floral-02.jpg" },
      ],
      minimalist: [
        { id: "minimal-01", thumb: "/templates/minimal-01.jpg", tag: "NEW" },
      ],
      romance: [{ id: "romance-01", thumb: "/templates/romance-01.jpg" }],
      classic: [{ id: "classic-01", thumb: "/templates/classic-01.jpg" }],
    },
    video: {
      floral: [
        {
          id: "floral-v1",
          thumb: "/templates/floral-v1.jpg",
          video: "/demo/demo-video.mp4",
          tag: "PREMIUM",
        },
      ],
      minimalist: [
        {
          id: "minimal-v1",
          thumb: "/templates/minimal-v1.jpg",
          video: "/demo/demo-video.mp4",
        },
      ],
      romance: [
        {
          id: "romance-v1",
          thumb: "/templates/romance-v1.jpg",
          video: "/demo/demo-video.mp4",
        },
      ],
      classic: [
        {
          id: "classic-v1",
          thumb: "/templates/classic-v1.jpg",
          video: "/demo/demo-video.mp4",
        },
      ],
    },
  },
};

export default function InvitationStep1Page() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("image");
  const [category, setCategory] = useState<Category>("floral");

  const templates = TEMPLATES.wedding[mode][category];

  const goNext = (templateId: string) => {
    router.push(`/invitation/details?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-16 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold mb-3 text-gray-900">
          Choose Your Style
        </h1>
        <p className="text-gray-500 text-lg">
          Select image or video and pick a luxury template
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-10 gap-4">
        <button
          onClick={() => setMode("image")}
          className={`px-7 py-2.5 rounded-full transition font-medium ${
            mode === "image"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 shadow"
          }`}
        >
          🖼 Image
        </button>
        <button
          onClick={() => setMode("video")}
          className={`px-7 py-2.5 rounded-full transition font-medium ${
            mode === "video"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 shadow"
          }`}
        >
          🎥 Video
        </button>
      </div>

      {/* Categories */}
      <div className="flex justify-center mb-14 gap-4 flex-wrap">
        {(["floral", "minimalist", "romance", "classic"] as Category[]).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2.5 rounded-full capitalize transition ${
                category === cat
                  ? "bg-purple-500 text-white shadow"
                  : "bg-white text-gray-700 shadow"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14 place-items-center">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="cursor-pointer group"
            onClick={() => goNext(tpl.id)}
          >
            <div className="relative w-[230px] h-[460px] rounded-[34px] bg-black shadow-2xl p-3 transform transition duration-300 group-hover:scale-105 group-hover:-translate-y-2">
              <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-black">
                <Image
                  src={tpl.thumb}
                  alt={tpl.id}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow">
                {mode.toUpperCase()}
              </div>

              {tpl.tag && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full shadow font-semibold">
                  {tpl.tag}
                </div>
              )}
            </div>

            <p className="text-center mt-4 text-sm font-medium text-gray-800 tracking-wide">
              {tpl.id.replace("-", " ").toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
