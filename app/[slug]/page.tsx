import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: { slug: string } }) {

  const { data } = await supabase
    .from("events")
    .select("hero_names, ending_photo")
    .eq("slug", params.slug)
    .single();

  const title = data?.hero_names || "Wedding Invitation";

  const image =
    data?.ending_photo ||
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf";

  return {
    title: `${title} Wedding`,
    description: `You're invited to ${title} Wedding`,

    openGraph: {
      title: `${title} Wedding`,
      description: `You're invited to ${title} Wedding`,
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
}

  return <WeddingClient event={data} />;
}