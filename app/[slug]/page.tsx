import WeddingClient from "./WeddingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: { slug: string };
};

// ✅ IMPORTANT: wrap metadata in function that uses params safely
export async function generateMetadata({ params }: Props) {
  const name = params.slug || "Guest";

  return {
    title: `${name}'s Invitation`,
    description: "You're invited to our special day 💍",
    openGraph: {
      title: `${name}'s Invitation`,
      url: `https://digital-invites-xi.vercel.app/${name}`, // ✅ FIXED
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

export default function Page({ params }: Props) {
  return <WeddingClient slug={params.slug} />;
}