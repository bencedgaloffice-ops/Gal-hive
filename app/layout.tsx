import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diósdi Méhes — Nyers méz, egyetlen tájról",
  description:
    "Egyszármazású, hidegen pörgetett nyers méz Diósd kaptáraiból — nyomon követhető az első csepptől.",
};

export const viewport: Viewport = {
  themeColor: "#0b0907",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Literal family names ("Fraunces" / "Work Sans" / "IBM Plex Mono") keep the
            hand-authored design CSS working unchanged. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..500;1,9..144,300..500&family=Work+Sans:wght@300;400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
