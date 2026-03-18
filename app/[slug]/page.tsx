import WeddingClient from "./WeddingClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const name = params.slug;

  return {
    title: `${name}'s Invitation`,
    description: "You're invited to our special day 💍",
    openGraph: {
      title: `${name}'s Invitation`,
      images: [
        {
          url: `https://igital-invites-xi.vercel.app/api/og?name=${name}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <WeddingClient slug={params.slug} />;
}