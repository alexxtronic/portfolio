import { ImageResponse } from "next/og";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post by Alexander D'Amore";

export async function generateStaticParams() {
    return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

// Share card for each post: title large on paper, with the orange mark and byline.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const post = await getPost((await params).slug);
    const title = post?.title ?? "Notes";
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#EFEEEA", color: "#0D0D0C", padding: "64px 72px" }}>
                <div style={{ display: "flex", alignItems: "center", fontSize: 24, letterSpacing: 2, textTransform: "uppercase" }}>
                    <div style={{ width: 18, height: 18, background: "#FF4F00", marginRight: 16 }} />
                    {post ? `${post.category} · ${formatDate(post.date)}` : "Notes"}
                </div>
                <div style={{ display: "flex", fontSize: title.length > 60 ? 64 : 78, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>{title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, borderTop: "2px solid #0D0D0C", paddingTop: 24 }}>
                    <span style={{ fontWeight: 700 }}>Alexander D&apos;Amore</span>
                    <span style={{ color: "#5F5E58" }}>alexanderdamore.com/blog</span>
                </div>
            </div>
        ),
        size,
    );
}
