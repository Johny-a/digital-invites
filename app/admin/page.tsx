"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const go = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      // Get this admin's event
      const { data: event, error } = await supabase
        .from("events")
        .select("slug")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      if (error || !event) {
        router.replace("/admin/login");
        return;
      }

      router.replace(`/admin/${event.slug}`);
    };

    go();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Loading...
    </div>
  );
}
