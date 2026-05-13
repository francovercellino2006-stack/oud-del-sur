import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Oud Del Sur | Perfumes Árabes Originales",
    template: "%s | Oud Del Sur",
  },
  description:
    "Perfumes árabes originales importados. Fragancias exclusivas de Lattafa, Armaf, Afnan y Maison Alhambra con proyección y duración extrema. Envíos a todo el país.",
  keywords: [
    "perfumes arabes",
    "oud",
    "lattafa",
    "armaf",
    "afnan",
    "maison alhambra",
    "perfumes importados",
    "perfumes argentina",
    "khamrah",
    "amber oud",
    "perfumes originales",
    "fragancias arabes",
  ],
  authors: [{ name: "Oud Del Sur" }],
  creator: "Oud Del Sur",
  metadataBase: new URL("https://ouddelsurperfumes.com"),
  alternates: {
    canonical: "https://ouddelsurperfumes.com",
  },
  openGraph: {
    title: "Oud Del Sur | Perfumes Árabes Originales",
    description:
      "Fragancias árabes exclusivas con proyección y duración extrema. Originales importados. Envíos a todo el país.",
    url: "https://ouddelsurperfumes.com",
    siteName: "Oud Del Sur",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Oud Del Sur - Perfumes Árabes Originales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oud Del Sur | Perfumes Árabes Originales",
    description: "Fragancias árabes exclusivas con proyección y duración extrema.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}