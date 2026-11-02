import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, getRelatedPosts, formatDate, SITE_URL, AUTHOR } from "@/lib/blog";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const post = await getPost((await params).slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.description,
        keywords: post.tags,
        authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            type: "article",
            title: post.title,
            description: post.description,
            url: `/blog/${post.slug}`,
            publishedTime: post.date,
            authors: [AUTHOR.name],
            tags: post.tags,
        },
        twitter: { card: "summary_large_image", title: post.title, description: post.description },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const post = await getPost((await params).slug);
    if (!post) notFound();
    const related = await getRelatedPosts(post);
    const url = `${SITE_URL}/blog/${post.slug}`;

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            url,
            mainEntityOfPage: url,
            image: `${url}/opengraph-image`,
            keywords: post.tags.join(", "),
            articleSection: post.category,
            wordCount: post.text.split(" ").length,
            author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url, jobTitle: AUTHOR.role, image: AUTHOR.image, sameAs: [AUTHOR.linkedin] },
            publisher: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Notes", item: `${SITE_URL}/blog` },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
        },
    ];

    return (
        <main className="j-post">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <nav className="j-crumbs mono" aria-label="Breadcrumb"><Link href="/blog">&larr; All notes</Link></nav>

            <header className="j-post__head">
                <p className="mono"><span className="sq" aria-hidden="true"></span>{post.category} &middot; <time dateTime={post.date}>{formatDate(post.date)}</time> &middot; {post.readTime} read</p>
                <h1>{post.title}</h1>
                <p className="j-post__dek">{post.description}</p>
                <div className="j-byline">
                    <img src="/assets/images/headshot.webp" alt="" width="48" height="48" />
                    <div><strong>{AUTHOR.name}</strong><span>{AUTHOR.role}</span></div>
                </div>
            </header>

            <div className="j-post__grid">
                {post.headings.length > 2 ? (
                    <aside className="j-toc" aria-label="In this post">
                        <p className="mono">In this post</p>
                        <ol>{post.headings.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
                    </aside>
                ) : null}
                <article className="j-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>

            <footer className="j-post__end">
                {post.tags.length ? (
                    <ul className="j-tags" aria-label="Topics">
                        {post.tags.map((t) => <li key={t}><Link className="j-chip mono" href={`/blog?q=${encodeURIComponent(t)}`}>{t}</Link></li>)}
                    </ul>
                ) : null}
                <div className="j-author">
                    <img src="/assets/images/headshot.webp" alt="Alexander D&rsquo;Amore" width="96" height="96" />
                    <div>
                        <p className="mono">Written by</p>
                        <p className="j-author__name">{AUTHOR.name}</p>
                        <p>Senior marketing creative and MarTech strategist. Over a decade of social, paid and brand work for names like the Empire State Building and Global Citizen, plus the CRM and automation that turn attention into pipeline. Freelancing remotely for US and EU teams from Copenhagen.</p>
                        <Link className="j-btn" href="/#hire">Work with me <span aria-hidden="true">&rarr;</span></Link>
                    </div>
                </div>
                {related.length ? (
                    <section className="j-related" aria-labelledby="related-title">
                        <h2 id="related-title" className="mono">Keep reading</h2>
                        <ol className="j-list">
                            {related.map((p) => (
                                <li key={p.slug}>
                                    <Link href={`/blog/${p.slug}`}>
                                        <span className="mono">{formatDate(p.date)}</span>
                                        <div><h3>{p.title}</h3><p>{p.description}</p></div>
                                        <span className="mono">{p.category} &middot; {p.readTime}</span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </section>
                ) : null}
            </footer>
        </main>
    );
}
