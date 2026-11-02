import type { Metadata } from "next";
import { getSearchablePosts, SITE_URL, AUTHOR } from "@/lib/blog";
import BlogIndex from "./BlogIndex";

const description = "Practical writing on AI, marketing automation, CRM and creative from Alexander D'Amore: what works in real teams, what doesn't, and how to set it up.";

export const metadata: Metadata = {
    title: "Notes on AI and marketing",
    description,
    alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: { title: "Notes on AI and marketing | Alexander D'Amore", description, url: "/blog", type: "website", images: [{ url: "/assets/images/graphimage.png", width: 1200, height: 630 }] },
};

export default async function BlogPage() {
    const posts = await getSearchablePosts();
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Notes on AI and marketing",
            url: `${SITE_URL}/blog`,
            description,
            author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
            blogPost: posts.map((p) => ({
                "@type": "BlogPosting",
                headline: p.title,
                url: `${SITE_URL}/blog/${p.slug}`,
                datePublished: p.date,
            })),
        },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Alexander D'Amore",
            url: SITE_URL,
            potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
                "query-input": "required name=search_term_string",
            },
        },
    ];

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <BlogIndex posts={posts} />
        </>
    );
}
