import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name") || "Guest";
  const heroNames = searchParams.get("title") || "The Wedding";
  const endingPhoto = searchParams.get("img") || "";

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
        <img
          src={endingPhoto}
          width="1200"
          height="630"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
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
          <p style={{ fontSize: 36 }}>You're Invited 💍</p>
          <h1 style={{ fontSize: 90 }}>{name}</h1>
          <p style={{ fontSize: 32 }}>to the wedding of</p>
          <p style={{ fontSize: 48, fontStyle: "italic" }}>
            {heroNames}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}