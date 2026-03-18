import WeddingClient from "./WeddingClient";

export const dynamic = "force-dynamic";

// ✅ THIS FIXES THE UNDEFINED SLUG ISSUE
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
) {
  const name = params.slug || "Guest";

  return {
    title: `${name}'s Invitation`,
    description: "You're invited to our special day 💍",
    openGraph: {
      title: `${name}'s Invitation`,
      description: "Join us for this special event",
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