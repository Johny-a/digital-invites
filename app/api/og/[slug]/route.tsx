import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request, { params }: any) {
  const slug = decodeURIComponent(params.slug);

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const names = data?.hero_names || "Wedding Invitation";
  const photo = data?.ending_photo;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          color: "white",
          fontSize: 60,
          fontWeight: 600,
        }}
      >
        {photo && (
          <img
            src={photo}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            bottom: 80,
            textAlign: "center",
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