import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/ogFont";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Notes on AI and marketing by Alexander D'Amore";

// Share card for the blog index, matching the post cards.
export default async function Image() {
    const fonts = await ogFonts();
    const display = fonts.length ? "Archivo Narrow" : undefined;
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#EFEEEA", color: "#0D0D0C", padding: "64px 72px" }}>
                <div style={{ display: "flex", alignItems: "center", fontSize: 24, letterSpacing: 2, textTransform: "uppercase" }}>
                    <div style={{ width: 18, height: 18, background: "#FF4F00", marginRight: 16 }} />
                    Notes from the work
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", fontFamily: display, fontSize: 260, fontWeight: 700, lineHeight: .8, letterSpacing: -8, textTransform: "uppercase" }}>Notes<span style={{ color: "#FF4F00" }}>.</span></div>
                    <div style={{ display: "flex", fontSize: 34, marginTop: 28 }}>AI, marketing automation, CRM and creative.</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, borderTop: "2px solid #0D0D0C", paddingTop: 24 }}>
                    <span style={{ fontWeight: 700 }}>Alexander D&apos;Amore</span>
                    <span style={{ color: "#5F5E58" }}>alexanderdamore.com/blog</span>
                </div>
            </div>
        ),
        { ...size, fonts },
    );
}
