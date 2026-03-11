import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const title = data?.hero_names || "Wedding Invitation";

  return {
    title,
    description: `You're invited to the wedding of ${title}`,
    openGraph: {
      title,
      description: "Tap to view the invitation",
      url: `https://digital-invites-xi.vercel.app/${slug}`,
      images: [`https://digital-invites-xi.vercel.app/api/og/${slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [`https://digital-invites-xi.vercel.app/api/og/${slug}`],
    },
  };
}

export default function Page() {
  return <WeddingClient />;
}