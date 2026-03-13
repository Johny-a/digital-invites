import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function generateMetadata(
  { params }: { params: { slug: string } }
) {

  const slug = decodeURIComponent(params.slug);

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const title = data?.hero_names || "Wedding Invitation";

  const ogImage = `https://digital-invites-xi.vercel.app/api/og/${slug}`;
  const url = `https://digital-invites-xi.vercel.app/${slug}`;

  return {
    title,
    description: `You're invited to the wedding of ${title}`,

    openGraph: {
      title,
      description: "Tap to view the invitation",
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImage],
    },
  };
}

export default function Page() {
  return <WeddingClient />;
}