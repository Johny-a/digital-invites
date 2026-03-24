import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET(request: Request, { params }) {
  const { name } = params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ use service key for upload
  );

  // Generate image
  const image = new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", display: "flex", alignItems: "center", justifyContent: "center", background: "black", color: "white" }}>
        <h1>{name}</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  // Convert to buffer
  const arrayBuffer = await image.arrayBuffer();

  // Upload to Supabase
  const filePath = `${name}.png`;

  await supabase.storage
    .from("og-images")
    .upload(filePath, arrayBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}