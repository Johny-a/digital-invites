import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
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
          alignItems: "flex-end",
          justifyContent: "center",
          background: "black",
          color: "white",
          position: "relative",
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
            fontSize: 72,
            fontWeight: 600,
            marginBottom: 80,
            background: "rgba(0,0,0,0.5)",
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