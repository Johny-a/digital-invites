import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = slug || "Guest";

  // Fetch hero names from supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: event } = await supabase
    .from("events")
    .select("hero_names")
    .single();

  const heroNames = event?.hero_names || "The Wedding";

  return {
    title: `${heroNames}'s Wedding Invitation`,  
    description: `You're invited to the wedding of ${heroNames} 💍`,
    openGraph: {
      title: `${heroNames}'s Wedding Invitation`,
      description: `You're invited to the wedding of ${heroNames} 💍`,
      url: `https://digital-invites-xi.vercel.app/${name}`,
      type: "website",
      images: [
        { url: `https://digital-invites-xi.vercel.app/api/og/${encodeURIComponent(name)}`,  // ✅ path not query
          width: 1200,
          height: 630,
          alt: `${heroNames}'s Wedding Invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${heroNames} - ${name}'s Invitation`,
      images: [`https://digital-invites-xi.vercel.app/api/og/${encodeURIComponent(name)}`],  // ✅ same here
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <WeddingClient slug={slug} />;
}