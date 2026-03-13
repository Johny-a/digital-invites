import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  return {
    title: "Wedding Invitation",
    description: "Tap to view the invitation",
    openGraph: {
      url: `https://digital-invites-xi.vercel.app/${slug}`,
      images: [`https://digital-invites-xi.vercel.app/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`https://digital-invites-xi.vercel.app/${slug}/opengraph-image`],
    },
  };
}