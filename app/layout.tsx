import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SINGLE metadata (PNG favicon)
export const metadata: Metadata = {
  title: {
    default: "Digital Invites",
    template: "%s | Digital Invites",
  },
  description: "Cinematic digital invitations for your special day",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  other: {
    "og:image:type": "image/jpeg",
    "og:image:secure_url":
      "https://digital-invites-xi.vercel.app/api/og",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ FORCE favicon (important for local) */}
        <link rel="icon" href="/favicon.png" type="image/png" />

        {/* Arabic font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}