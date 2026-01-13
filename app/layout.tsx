import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { GlassNav } from "@/components/GlassNav";
import { Footer } from "@/components/Footer";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexander D'Amore | AI & Marketing Specialist",
    description:
      "I build AI-driven marketing systems that turn noise into pipeline.",
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
        className={`${inter.variable} ${cormorant.variable} antialiased bg-brand-black text-brand-white overflow-x-clip`}
      >
        <GlassNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
