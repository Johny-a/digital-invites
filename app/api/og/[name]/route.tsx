import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: event } = await supabase
    .from("events")
    .select("ending_photo, hero_names")
    .single();

  const endingPhoto = event?.ending_photo || "";
  const heroNames = event?.hero_names || "The Wedding";

  // ✅ FETCH IMAGE HERE (outside JSX)
  let imageBuffer: ArrayBuffer | null = null;

  if (endingPhoto) {
    const imageRes = await fetch(endingPhoto);

    if (imageRes.ok) {
      imageBuffer = await imageRes.arrayBuffer();
    }
  }

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
        }}
      >
        {/* ✅ USE BUFFER HERE */}
        {imageBuffer && (
          <img
            src={imageBuffer as any}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 36, margin: 0 }}>
            You're Invited 💍
          </p>
          <h1 style={{ fontSize: 90, margin: "16px 0", fontWeight: 700 }}>
            {name}
          </h1>
          <p style={{ fontSize: 32, margin: 0 }}>
            to the wedding of
          </p>
          <p
            style={{
              fontSize: 48,
              margin: "8px 0",
              fontStyle: "italic",
            }}
          >
            {heroNames}
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}