import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET(request: Request, context: any) {
  const { name } = context.params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
        }}
      >
        <h1>{name}</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  const arrayBuffer = await image.arrayBuffer();

  await supabase.storage
    .from("og-images")
    .upload(`${name}.png`, arrayBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}