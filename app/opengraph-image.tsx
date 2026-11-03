import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/ogFont";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Alexander D'Amore, senior marketing creative and MarTech strategist";

// The site's share card: the name set like the homepage hero, with the client list underneath.
export default async function Image() {
    const fonts = await ogFonts();
    const display = fonts.length ? "Archivo Narrow" : undefined;
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#EFEEEA", color: "#0D0D0C", padding: "60px 72px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2, textTransform: "uppercase", borderBottom: "2px solid #0D0D0C", paddingBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center" }}><div style={{ width: 16, height: 16, background: "#FF4F00", marginRight: 14 }} />Senior marketing creative &amp; MarTech strategist</div>
                    <span style={{ color: "#5F5E58" }}>Copenhagen · Remote</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", fontFamily: display, fontSize: 168, fontWeight: 700, lineHeight: .84, letterSpacing: -6, textTransform: "uppercase" }}>
                    <span>Alexander</span>
                    <div style={{ display: "flex" }}>D&rsquo;Amore<span style={{ color: "#FF4F00" }}>.</span></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#5F5E58" }}>
                    <span>Empire State Building · Global Citizen · Novo Nordisk · Specsavers</span>
                    <span style={{ color: "#0D0D0C", fontWeight: 700 }}>alexanderdamore.com</span>
                </div>
            </div>
        ),
        { ...size, fonts },
    );
}
