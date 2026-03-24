import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = slug || "Guest";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: event } = await supabase
    .from("events")
    .select("hero_names")
    .single();

  const heroNames = event?.hero_names || "The Wedding";

  // ✅ ADD THIS RIGHT HERE (THIS WAS MISSING)
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/og-images/${name}.png`;

  return {
    title: `${heroNames}'s Wedding Invitation`,
    description: `You're invited to the wedding of ${heroNames} 💍`,
    openGraph: {
      title: `${heroNames}'s Wedding Invitation`,
      description: `You're invited to the wedding of ${heroNames} 💍`,
      url: `https://digital-invites-xi.vercel.app/${name}`,
      type: "website",
      images: [
        {
          url: imageUrl, // ✅ now defined
          width: 1200,
          height: 630,
          alt: `${heroNames}'s Wedding Invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${heroNames} - ${name}'s Invitation`,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <WeddingClient slug={slug} />;
}