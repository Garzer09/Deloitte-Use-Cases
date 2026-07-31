import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title =
    "Banco de casos de uso · Microsoft 365 Copilot · Deloitte × Spiralia";
  const description =
    "205 casos de uso auditados y navegables para diseñar itinerarios de adopción de Microsoft 365 Copilot en Deloitte.";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    icons: {
      icon: "/brand/spiralia-symbol.png",
      shortcut: "/brand/spiralia-symbol.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_ES",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1200,
          height: 630,
          alt: "Banco de casos de uso de Microsoft 365 Copilot · 205 casos auditados",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
