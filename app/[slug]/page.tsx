import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function generateMetadata({ params }: { params: { slug: string } }) {

  const slug = params.slug;

  const { data } = await supabase
    .from("events")
    .select("hero_names, ending_photo")
    .eq("slug", slug)
    .single();

  const title = data?.hero_names || "Wedding Invitation";
  const image = data?.ending_photo || "https://digital-invites-xi.vercel.app/og-default.jpg";

  return {
    title,
    description: `You're invited to the wedding of ${title}`,
    openGraph: {
      title,
      description: "Tap to view the invitation",
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