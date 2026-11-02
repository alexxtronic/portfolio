import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Homepage type: Archivo with its width axis for the condensed and wide cuts, plus Plex Mono for labels.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Alexander D'Amore | AI & Marketing Specialist",
  description:
    "Senior AI & Marketing Specialist building automation systems that turn noise into pipeline. Expert in HubSpot, AI agents, and growth frameworks.",
  keywords: [
    "AI Marketing",
    "Marketing Automation",
    "HubSpot",
    "Growth Marketing",
    "AI Specialist",
    "n8n",
    "Agentic AI",
  ],
  authors: [{ name: "Alexander D'Amore" }],
  openGraph: {
    title: "Alexander D'Amore | AI & Marketing Specialist",
    description:
      "I build AI-driven marketing systems that turn noise into pipeline.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/images/graphimage.png",
        width: 1200,
        height: 630,
        alt: "Alexander D'Amore - AI & Marketing Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexander D'Amore | AI & Marketing Specialist",
    description:
      "I build AI-driven marketing systems that turn noise into pipeline.",
    images: ["/assets/images/graphimage.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${cormorant.variable} ${archivo.variable} ${plexMono.variable} antialiased bg-brand-black text-brand-white overflow-x-clip`}
      >
        {children}
      </body>
    </html>
  );
}
