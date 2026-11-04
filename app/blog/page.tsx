import type { Metadata } from "next";
import { getSearchablePosts, SITE_URL, AUTHOR, BLOG } from "@/lib/blog";
import BlogIndex from "./BlogIndex";

const description = BLOG.description;

export const metadata: Metadata = {
    title: `${BLOG.name}: practical AI for old-school marketers`,
    description,
    alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: { title: `${BLOG.name} | Alexander D'Amore`, description, url: "/blog", type: "website" },
};

export default async function BlogPage() {
    const posts = await getSearchablePosts();
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: BLOG.name,
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
