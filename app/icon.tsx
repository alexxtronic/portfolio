import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/ogFont";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon: a condensed "A" with the orange full stop, on ink.
export default async function Icon() {
    const fonts = await ogFonts();
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", background: "#0D0D0C", color: "#EFEEEA", borderRadius: 12, paddingBottom: 6, fontFamily: fonts.length ? "Archivo Narrow" : undefined, fontSize: 56, fontWeight: 700, lineHeight: 1 }}>
                A<div style={{ width: 10, height: 10, background: "#FF4F00", marginBottom: 6, marginLeft: 2 }} />
            </div>
        ),
        { ...size, fonts },
    );
}
