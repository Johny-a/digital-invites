import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: { slug: string } }) {

  const { data } = await supabase
    .from("events")
    .select("hero_names, cover_image")
    .eq("slug", params.slug)
    .single();

  const title = data?.hero_names || "Wedding Invitation";

  const image =
    data?.cover_image ||
    "https://digital-invites-xi.vercel.app/og-default.jpg";

return {
  title,
  description: `You're invited to the wedding of ${title}`,

  openGraph: {
    title,
    description: "Tap to view the invitation",
    url: `https://digital-invites-xi.vercel.app/${params.slug}`,
    images: [
      {
        url: image,
        width: 1200,
        height: 630
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    images: [image]
  }
};

  return <WeddingClient event={data} />;
}