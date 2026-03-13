import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
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
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        color: "white",
        flexDirection: "column",
      }}
    >
      {photo && (
        <img
          src={photo}
          style={{
            position: "absolute",
            width: "1200px",
            height: "630px",
            objectFit: "cover",
            top: 0,
            left: 0,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      <div
        style={{
          fontSize: 70,
          fontWeight: 600,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {names}
      </div>

      <div
        style={{
          fontSize: 32,
          marginTop: 20,
          opacity: 0.9,
          zIndex: 10,
        }}
      >
        You're invited
      </div>
    </div>
  ),
  {
    width: 1200,
    height: 630,
  }
);