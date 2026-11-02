"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "@/lib/notion";

interface BlogPageClientProps {
    posts: BlogPost[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
    const featuredPost = posts.find((p) => p.featured);
    const regularPosts = posts.filter((p) => !p.featured);

    return (
        <main className="min-h-screen pt-32 pb-24">
            {/* Hero */}
            <section className="container mx-auto px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <span className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-[0.3em] text-brand-blue mb-4 block">
                        Insights
                    </span>
                    <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl mb-6">
                        The <span className="italic text-brand-white/60">blog</span>
                    </h1>
                    <p className="text-lg text-brand-white/60 max-w-xl">
                        Practical insights on AI, automation, and marketing systems.
                        No fluff, just what works.
                    </p>
                </motion.div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="container mx-auto px-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <FeaturedPostCard post={featuredPost} />
                    </motion.div>
                </section>
            )}

            {/* Post Grid */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                            <PostCard post={post} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Coming Soon Note */}
            <section className="container mx-auto px-6 mt-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center py-12 border-t border-brand-white/5"
                >
                    <p className="text-brand-white/30 text-sm">
                        More posts coming soon. Subscribe via{" "}
                        <a
                            href="mailto:alexdamore2@gmail.com?subject=Blog%20Subscription"
                            className="text-brand-blue hover:underline"
                        >
                            email
                        </a>{" "}
                        to get notified.
                    </p>
                </motion.div>
            </section>
        </main>
    );
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="block group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12 bg-brand-white/5 backdrop-blur-xl border border-brand-white/10 rounded-3xl">
                {/* Content */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 text-xs uppercase tracking-widest text-brand-blue bg-brand-blue/10 rounded-full">
                            Featured
                        </span>
                        <span className="text-xs text-brand-white/40">{post.category}</span>
                    </div>

                    <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl mb-4 group-hover:text-brand-blue transition-colors">
                        {post.title}
                    </h2>

                    <p className="text-brand-white/60 mb-6">{post.excerpt}</p>

                    <div className="flex items-center gap-4 text-xs text-brand-white/40">
                        <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        <span>•</span>
                        <span>{post.readTime} read</span>
                    </div>
                </div>

                {/* Placeholder Image Area */}
                <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-blue/20 to-brand-red/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-[family-name:var(--font-cormorant)] italic text-brand-white/20">
                            {post.category}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function PostCard({ post }: { post: BlogPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="block group h-full">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full"
            >
                <div className="h-full p-6 bg-brand-white/5 backdrop-blur-xl border border-brand-white/10 rounded-2xl hover:bg-brand-white/[0.07] transition-colors flex flex-col">
                    {/* Category */}
                    <span className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-widest text-brand-blue mb-3">
                        {post.category}
                    </span>

                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl mb-3 group-hover:text-brand-blue transition-colors">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-brand-white/60 text-sm mb-6 flex-grow line-clamp-3">
                        {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-brand-white/40 mt-auto">
                        <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export default BlogPageClient;
