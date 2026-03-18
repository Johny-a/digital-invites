import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Guest";

  // Fetch your ending/hero photo as base64 or use a public URL
  const imageUrl = "https://digital-invites-xi.vercel.app/ending-photo.jpg"; // 👈 your actual photo

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
        {/* Background: your ending photo */}
        <img
          src={imageUrl}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dark overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)",
          }}
        />

        {/* Name + text on top */}
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
          <p style={{ fontSize: 36, margin: 0, letterSpacing: 4 }}>
            You're Invited
          </p>
          <h1 style={{ fontSize: 80, margin: "12px 0", fontWeight: 700 }}>
            {name}
          </h1>
          <p style={{ fontSize: 28, margin: 0 }}>
            Join us for our special day 💍
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}