import { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og/${encodeURIComponent(name)}`;

  return {
    title: `${decodedName} - Wedding Invitation 💍`,
    description: `You're invited to the wedding! Open to see your personal invitation.`,
    openGraph: {
      title: `${decodedName} - Wedding Invitation 💍`,
      description: `You're invited to the wedding! Open to see your personal invitation.`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Wedding invitation for ${decodedName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedName} - Wedding Invitation  💍`,
      description: `You're invited to the wedding!`,
      images: [ogImageUrl],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return (
    <main>
      {/* Your existing invite page UI here */}
      <h1>Welcome, {decodedName}</h1>
    </main>
  );
}
