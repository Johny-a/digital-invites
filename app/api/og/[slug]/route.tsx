import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {

  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", decodedSlug)
    .maybeSingle();

  const names = data?.hero_names || "Wedding Invitation";
  const photo = data?.ending_photo;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "black",
          color: "white",
        }}
      >

        {photo && (
          <img
            src={photo}
            width="1200"
            height="630"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "relative",
            fontSize: 72,
            fontWeight: 600,
            marginBottom: 60,
            background: "rgba(0,0,0,0.4)",
            padding: "20px 40px",
            borderRadius: 20,
          }}
        >
          {names}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}