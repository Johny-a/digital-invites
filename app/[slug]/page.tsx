import WeddingClient from "./WeddingClient";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const name = params?.slug || "Guest";

  const imageUrl = `https://igital-invites-xi.vercel.app/api/og?name=${name}`;

  return {
    title: `${name}'s Invitation`,
    description: "You're invited to our special day 💍",
    openGraph: {
      title: `${name}'s Invitation`,
      description: "Join us for this special event",
      url: `https://igital-invites-xi.vercel.app/${name}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}'s Invitation`,
      description: "You're invited 💌",
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <WeddingClient />;
}