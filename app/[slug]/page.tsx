import WeddingClient from "./WeddingClient";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const h = await headers();

  // Get full URL (works on Vercel)
  const url =
    h.get("x-forwarded-proto") +
    "://" +
    h.get("host") +
    h.get("x-forwarded-uri");

  // Extract slug
  const slug = url?.split("/").pop() || "Guest";

  const name = decodeURIComponent(slug);

  return {
    title: `${name}'s Invitation`,
    description: "You're invited to our special day 💍",
    openGraph: {
      title: `${name}'s Invitation`,
      description: "Join us for this special event",
      images: [
        {
          url: `https://igital-invites-xi.vercel.app/api/og?name=${name}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}'s Invitation`,
      images: [`https://igital-invites-xi.vercel.app/api/og?name=${name}`],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <WeddingClient slug={params.slug} />;
}