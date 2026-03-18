import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "Guest";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          color: "#fff",
          fontSize: 60,
          fontWeight: "bold",
        }}
      >
        {name}'s Invitation 💌
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}