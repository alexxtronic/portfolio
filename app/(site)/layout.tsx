import { GlassNav } from "@/components/GlassNav";
import { Footer } from "@/components/Footer";
import { AudioProvider } from "@/context/AudioContext";
import { BottomAudioPlayer } from "@/components/BottomAudioPlayer";

// Blog, work and contact keep the original nav, footer and audio player; the homepage has its own chrome.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AudioProvider>
      <GlassNav />
      <main>{children}</main>
      <BottomAudioPlayer />
      <Footer />
    </AudioProvider>
  );
}
