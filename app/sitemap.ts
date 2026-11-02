import { MetadataRoute } from "next";
import { getAllPosts, SITE_URL } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPosts();
    const latest = posts[0]?.date.slice(0, 10);

    return [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
        { url: `${SITE_URL}/blog`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
        ...posts.map((p) => ({
            url: `${SITE_URL}/blog/${p.slug}`,
            lastModified: p.date.slice(0, 10),
            changeFrequency: "yearly" as const,
            priority: 0.7,
        })),
        { url: `${SITE_URL}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    ];
}
