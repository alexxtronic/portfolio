import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/ogFont";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: the favicon mark, larger.
export default async function AppleIcon() {
    const fonts = await ogFonts();
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", background: "#0D0D0C", color: "#EFEEEA", paddingBottom: 18, fontFamily: fonts.length ? "Archivo Narrow" : undefined, fontSize: 156, fontWeight: 700, lineHeight: 1 }}>
                A<div style={{ width: 26, height: 26, background: "#FF4F00", marginBottom: 18, marginLeft: 6 }} />
            </div>
        ),
        { ...size, fonts },
    );
}
