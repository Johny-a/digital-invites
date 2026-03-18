import WeddingClient from "./WeddingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;  // ✅ await params
  const name = slug || "Guest";

  return {
    title: `${name}'s Invitation`,
    description: "You're invited to our special day 💍",
    openGraph: {
      title: `${name}'s Invitation`,
      description: "You're invited to our special day 💍",
      url: `https://digital-invites-xi.vercel.app/${name}`,
      type: "website",
      images: [
        {
          url: `https://digital-invites-xi.vercel.app/api/og?name=${encodeURIComponent(name)}`,
          width: 1200,
          height: 630,
          alt: `${name}'s Wedding Invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}'s Invitation`,
      images: [`https://digital-invites-xi.vercel.app/api/og?name=${encodeURIComponent(name)}`],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;  // ✅ await here too
  return <WeddingClient slug={slug} />;
}