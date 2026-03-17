"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import InvitationPlayer from "../components/InvitationPlayer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WeddingPage() {
  const params = useParams();
  const rawSlug = params.slug as string;
  const slug = decodeURIComponent(rawSlug);

  const [event, setEvent] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error(error);
        setEvent(null);
        return;
      }

      setEvent(data);
    };

    load();
  }, [slug]);

  if (!mounted) return null;

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black gap-4">
        <div>Loading invitation...</div>
        <div className="text-white/60 text-sm">
          If it takes too long, refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center p-4">
      <div className="relative bg-black rounded-[2rem] overflow-hidden aspect-[9/16] w-full max-w-[390px] max-h-[85vh] shadow-2xl border border-white/10">
        <InvitationPlayer
          event={event}
          templateId={event.template_id || "classic-01"}
        />
      </div>
    </div>
  );
}