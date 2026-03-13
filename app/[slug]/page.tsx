import { createClient } from "@supabase/supabase-js";
import WeddingClient from "./WeddingClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function generateMetadata({ params }: { params: { slug: string } }) {

  const title = "Wedding Invitation";

  return {
    title,
    description: "Tap to view the invitation",
    openGraph: {
      title,
      description: "Tap to view the invitation",
      images: [`/${params.slug}/opengraph-image`],
    },
  };
}

export default function Page() {
  return <WeddingClient />;
}