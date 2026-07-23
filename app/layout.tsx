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
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Cinzel:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=Great+Vibes&family=Parisienne&family=Marhey:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>

<link
  rel="preconnect"
  href="https://fonts.googleapis.com"
/>

<link
  rel="preconnect"
  href="https://fonts.gstatic.com"
  crossOrigin="anonymous"
/>

<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Cinzel:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=Great+Vibes&family=Parisienne&family=Amiri:wght@400;700&display=swap"
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