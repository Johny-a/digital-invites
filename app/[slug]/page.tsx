import { notFound } from "next/navigation";
import WeddingClient from "./WeddingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const name = params.slug; // ❌ remove the || "Guest" fallback
  if (!name) return {};     // just return empty if no slug

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

export default function Page({ params }: Props) {
  return <WeddingClient slug={params.slug} />;
}
```

Then push, and in Facebook debugger paste:
```
https://digital-invites-xi.vercel.app/Ralph