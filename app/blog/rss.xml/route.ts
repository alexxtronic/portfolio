import { getAllPosts, SITE_URL, AUTHOR, BLOG } from "@/lib/blog";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
    const posts = await getAllPosts();
    const items = posts
        .map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date.slice(0, 10) + "T12:00:00Z").toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.description)}</description>
    </item>`)
        .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(BLOG.name)} | ${esc(AUTHOR.name)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(BLOG.tagline)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;
    return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
