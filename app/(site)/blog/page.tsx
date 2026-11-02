import { getBlogPosts, fallbackPosts } from "@/lib/notion";
import BlogPageClient from "./BlogPageClient";

export default async function BlogPage() {
    // Try to fetch from Notion, fallback to static posts
    let posts = await getBlogPosts();

    if (posts.length === 0) {
        posts = fallbackPosts;
    }

    return <BlogPageClient posts={posts} />;
}

export const revalidate = 60; // Revalidate every 60 seconds
