import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Guest";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#1a1a2e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <p style={{ fontSize: 36, margin: 0 }}>You're Invited 💍</p>
        <h1 style={{ fontSize: 90, margin: "16px 0" }}>{name}</h1>
        <p style={{ fontSize: 28, margin: 0 }}>Join us for our special day</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}