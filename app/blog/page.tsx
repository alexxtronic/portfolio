import { getBlogPosts, BlogPost } from "@/lib/notion";
import BlogPageClient from "./BlogPageClient";

// Fallback posts when Notion is not configured
const fallbackPosts: BlogPost[] = [
    {
        id: "1",
        slug: "agentic-automation-2026",
        title: "Agentic Automation: What It Actually Means for Marketing",
        excerpt:
            "Everyone's talking about AI agents, but few understand how to actually deploy them in marketing operations. Here's what I've learned building multi-agent systems.",
        date: "2026-01-10",
        readTime: "8 min",
        category: "AI",
        featured: true,
        published: true,
    },
    {
        id: "2",
        slug: "hubspot-enterprise-migration-guide",
        title: "The Complete Guide to HubSpot Enterprise Migration",
        excerpt:
            "Migrated 50,000+ contacts without losing a single record. This is the playbook I wish I had when I started.",
        date: "2026-01-05",
        readTime: "12 min",
        category: "CRM",
        featured: false,
        published: true,
    },
    {
        id: "3",
        slug: "n8n-vs-make-vs-zapier",
        title: "n8n vs Make vs Zapier: An Honest Comparison",
        excerpt:
            "After building production workflows on all three, here's which one I actually use and why the answer isn't one-size-fits-all.",
        date: "2025-12-20",
        readTime: "10 min",
        category: "Automation",
        featured: false,
        published: true,
    },
    {
        id: "4",
        slug: "ai-marketing-without-the-hype",
        title: "AI Marketing Without the Hype: What Actually Works",
        excerpt:
            "Cutting through the noise to show you the AI tools and techniques that are generating real results right now.",
        date: "2025-12-15",
        readTime: "7 min",
        category: "AI",
        featured: false,
        published: true,
    },
];

export default async function BlogPage() {
    // Try to fetch from Notion, fallback to static posts
    let posts = await getBlogPosts();

    if (posts.length === 0) {
        posts = fallbackPosts;
    }

    return <BlogPageClient posts={posts} />;
}

export const revalidate = 60; // Revalidate every 60 seconds
