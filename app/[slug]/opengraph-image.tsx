import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {

  const { data } = await supabase
    .from("events")
    .select("hero_names, ending_photo")
    .eq("slug", params.slug)
    .single();

  const title = data?.hero_names || "Wedding Invitation";
  const photo = data?.ending_photo;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
          fontSize: 70,
          fontWeight: 600,
        }}
      >
        {photo && (
          <img
            src={photo}
            width="1200"
            height="630"
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "relative",
            background: "rgba(0,0,0,0.5)",
            padding: "20px 40px",
            borderRadius: 20,
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}