import WeddingClient from "./WeddingClient";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const h = await headers();

  // Get pathname safely
  const pathname =
    h.get("x-pathname") ||
    h.get("x-forwarded-uri") ||
    "/";

  // Extract slug safely
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] || "Guest";

  const name = decodeURIComponent(slug);

  return {
    title: `${name}'s Invitation`,
    description: "You're invited to our special day 💍",
    openGraph: {
      title: `${name}'s Invitation`,
      description: "Join us for this special event",
      url: `https://digital-invites-xi.vercel.app/${name}`,
      images: [
        {
          url: `https://digital-invites-xi.vercel.app/api/og?name=${name}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}'s Invitation`,
      images: [`https://digital-invites-xi.vercel.app/api/og?name=${name}`],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <WeddingClient slug={params.slug} />;
}