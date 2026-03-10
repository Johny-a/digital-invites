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
  hero_names: "Chris & Karen",
  hero_tagline: "Together in Christ, Forever in Love",
  hero_headline: "The wedding day has arrived!",

  ending_photo: "",

  date_text: "September 21, 2026",
  location_text: "Beirut, Lebanon",

  bg_video: "",
  music_url: "",

  gallery: [],

  gifts: [],

  ending_message: "We can’t wait to celebrate with you ❤️",
};


  return <InvitationPlayer event={demoEvent} templateId={template} />;
}
