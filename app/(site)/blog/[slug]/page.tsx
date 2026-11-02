import { getBlogPostBySlug, getAllPostSlugs, getStaticBlogPost, getStaticPostSlugs } from "@/lib/notion";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    // Get slugs from Notion if available, otherwise use static slugs
    let slugs = await getAllPostSlugs();

    if (slugs.length === 0) {
        slugs = getStaticPostSlugs();
    }

    return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;

    // Try Notion first, then fallback to static content
    let post = await getBlogPostBySlug(slug);

    if (!post) {
        post = getStaticBlogPost(slug);
    }

    if (!post) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}

export const revalidate = 60;
export const dynamicParams = true;
