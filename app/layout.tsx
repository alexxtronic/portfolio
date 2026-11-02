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

const siteDescription =
  "Alexander D'Amore is a senior marketing creative and MarTech strategist. Social, paid and brand work for names like the Empire State Building and Global Citizen, plus the CRM, AI and automation that turn attention into pipeline. Freelance, remote, for US and EU teams.";

export const metadata: Metadata = {
  metadataBase: new URL("https://alexanderdamore.com"),
  title: {
    default: "Alexander D'Amore | Senior Marketing Creative & MarTech Strategist",
    template: "%s | Alexander D'Amore",
  },
  description: siteDescription,
  keywords: [
    "Freelance marketing creative",
    "MarTech strategist",
    "AI marketing",
    "Marketing automation",
    "HubSpot",
    "Lead scoring",
    "Clay",
    "n8n",
    "Social media strategy",
  ],
  authors: [{ name: "Alexander D'Amore", url: "https://alexanderdamore.com" }],
  alternates: { canonical: "/", types: { "application/rss+xml": "/blog/rss.xml" } },
  openGraph: {
    title: "Alexander D'Amore | Senior Marketing Creative & MarTech Strategist",
    description: siteDescription,
    url: "/",
    siteName: "Alexander D'Amore",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/images/graphimage.png",
        width: 1200,
        height: 630,
        alt: "Alexander D'Amore, senior marketing creative and MarTech strategist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexander D'Amore | Senior Marketing Creative & MarTech Strategist",
    description: siteDescription,
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
