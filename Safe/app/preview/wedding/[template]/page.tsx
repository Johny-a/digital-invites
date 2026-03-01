"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InvitationPlayer from "../../../components/InvitationPlayer";

export default function WeddingTemplatePreviewPage() {
  const params = useParams();
  const template = params.template as string;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const demoEvent = {
  title: "Chris & Karen",
  message: "We are getting married",
  date: "September 21, 2026",
  location: "Beirut, Lebanon",
  cover_video_url: "/demo/demo-video.mp4",
  music_url: "/demo/demo-music.mp3",
  image_urls: [
    "/demo/demo1.jpg",
    "/demo/demo2.jpg",
    "/demo/demo3.jpg",
  ],
};


  return <InvitationPlayer event={demoEvent} templateId={template} />;
}
