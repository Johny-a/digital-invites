import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: any) {
  const slug = decodeURIComponent(params.slug);

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const title = data?.hero_names || "Wedding Invitation";

  const image =
    data?.ending_photo ||
    "https://digital-invites-xi.vercel.app/default-preview.jpg";

  return {
    title,
    description: "You are invited to our special day",
    openGraph: {
      title,
      description: "Tap to view the invitation",
      url: `https://digital-invites-xi.vercel.app/${slug}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [image],
    },
  };
}

export default function Page() {
  return <WeddingClient />;
}