"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPostWithContent, NotionBlock as NotionBlockType } from "@/lib/notion";

interface BlogPostClientProps {
    post: BlogPostWithContent;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
    return (
        <main className="min-h-screen pt-32 pb-24">
            <article className="container mx-auto px-6 max-w-3xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-brand-white/50 hover:text-brand-blue transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 text-xs uppercase tracking-widest text-brand-blue bg-brand-blue/10 rounded-full">
                            {post.category}
                        </span>
                        <span className="text-xs text-brand-white/40">
                            {new Date(post.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                        <span className="text-xs text-brand-white/40">•</span>
                        <span className="text-xs text-brand-white/40">{post.readTime} read</span>
                    </div>

                    <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl mb-6">
                        {post.title}
                    </h1>

                    <p className="text-xl text-brand-white/60 leading-relaxed">
                        {post.excerpt}
                    </p>
                </motion.header>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none"
                >
                    {post.content.map((block) => (
                        <NotionBlock key={block.id} block={block} />
                    ))}
                </motion.div>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 pt-8 border-t border-brand-white/10"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-brand-white/50 text-sm">
                            Want to discuss this topic?{" "}
                            <a
                                href="mailto:alexdamore2@gmail.com"
                                className="text-brand-blue hover:underline"
                            >
                                Get in touch
                            </a>
                        </p>
                        <Link
                            href="/blog"
                            className="text-brand-white/50 hover:text-brand-blue transition-colors text-sm"
                        >
                            ← More articles
                        </Link>
                    </div>
                </motion.footer>
            </article>
        </main>
    );
}

// Helper to safely get rich text
function getRichText(richText: { plain_text: string }[] | undefined): string {
    if (!richText || !Array.isArray(richText)) return "";
    return richText.map((t) => t.plain_text).join("");
}

// Render Notion blocks
function NotionBlock({ block }: { block: NotionBlockType }) {
    const type = block.type;
    const blockData = block as Record<string, unknown>;

    switch (type) {
        case "paragraph": {
            const data = blockData.paragraph as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            if (!text) return null;
            return <p className="mb-4 text-brand-white/80 leading-relaxed">{text}</p>;
        }

        case "heading_1": {
            const data = blockData.heading_1 as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            return (
                <h2 className="font-[family-name:var(--font-cormorant)] text-3xl mt-12 mb-6 text-brand-white">
                    {text}
                </h2>
            );
        }

        case "heading_2": {
            const data = blockData.heading_2 as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            return (
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl mt-10 mb-4 text-brand-white">
                    {text}
                </h3>
            );
        }

        case "heading_3": {
            const data = blockData.heading_3 as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            return (
                <h4 className="font-semibold text-xl mt-8 mb-3 text-brand-white">
                    {text}
                </h4>
            );
        }

        case "bulleted_list_item": {
            const data = blockData.bulleted_list_item as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            return (
                <li className="ml-6 mb-2 text-brand-white/80 list-disc">
                    {text}
                </li>
            );
        }

        case "numbered_list_item": {
            const data = blockData.numbered_list_item as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            return (
                <li className="ml-6 mb-2 text-brand-white/80 list-decimal">
                    {text}
                </li>
            );
        }

        case "quote": {
            const data = blockData.quote as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            return (
                <blockquote className="border-l-4 border-brand-blue pl-6 my-6 italic text-brand-white/70">
                    {text}
                </blockquote>
            );
        }

        case "code": {
            const data = blockData.code as { rich_text?: { plain_text: string }[] } | undefined;
            const text = getRichText(data?.rich_text);
            return (
                <pre className="bg-brand-black/50 border border-brand-white/10 rounded-xl p-4 my-6 overflow-x-auto">
                    <code className="text-sm text-brand-white/80 font-mono">
                        {text}
                    </code>
                </pre>
            );
        }

        case "divider":
            return <hr className="my-8 border-brand-white/10" />;

        default:
            return null;
    }
}
