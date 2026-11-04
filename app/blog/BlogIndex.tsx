"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SearchablePost } from "@/lib/blog";

function formatDate(date: string): string {
    return new Date(date.slice(0, 10) + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function BlogIndex({ posts }: { posts: SearchablePost[] }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");

    // ?q= in the link pre-fills the search (it's also the target of the site's search markup for Google).
    useEffect(() => {
        const q = new URLSearchParams(window.location.search).get("q");
        if (q) setQuery(q);
    }, []);

    useEffect(() => {
        const url = new URL(window.location.href);
        if (query) url.searchParams.set("q", query);
        else url.searchParams.delete("q");
        window.history.replaceState(null, "", url);
    }, [query]);

    const categories = useMemo(() => {
        const counts = new Map<string, number>();
        posts.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
        return [["All", posts.length] as const, ...[...counts.entries()].sort((a, b) => b[1] - a[1])];
    }, [posts]);

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results = posts.filter((p) => (category === "All" || p.category === category) && terms.every((t) => p.search.includes(t)));
    const browsing = !terms.length && category === "All";
    const featured = browsing ? posts.find((p) => p.featured) || posts[0] : null;
    const rest = featured ? results.filter((p) => p.slug !== featured.slug) : results;

    return (
        <main className="j-index">
            <p className="j-head mono"><span><span className="sq" aria-hidden="true"></span>The Snarky AI Marketer</span><span>{posts.length} posts &middot; <a href="/blog/rss.xml">RSS</a></span></p>
            <div className="j-intro">
                <h1 className="j-title">Blog<span className="dot">.</span></h1>
                <p className="j-dek">Practical AI for marketers who still believe in briefs, positioning and a decent headline. How to use the new tools the old-school way, without the hype, the &ldquo;game-changers&rdquo; or the fourteen-tool stack.</p>
            </div>

            <div className="j-tools">
                <label className="j-search">
                    <span className="mono">Search</span>
                    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="HubSpot, agents, TikTok…" aria-label="Search posts" />
                </label>
                <div className="j-chips" role="group" aria-label="Filter by topic">
                    {categories.map(([name, count]) => (
                        <button key={name} type="button" className="j-chip mono" aria-pressed={category === name} onClick={() => setCategory(name)}>
                            {name} <span>{count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {featured ? (
                <Link className="j-feature" href={`/blog/${featured.slug}`}>
                    <span className="mono">Latest &middot; {featured.category} &middot; {formatDate(featured.date)}</span>
                    <h2>{featured.title}</h2>
                    <p>{featured.description}</p>
                    <span className="j-feature__go mono">Read &middot; {featured.readTime} <span aria-hidden="true">&rarr;</span></span>
                </Link>
            ) : (
                <p className="j-count mono" aria-live="polite">{results.length} {results.length === 1 ? "post" : "posts"}{terms.length ? <> for &ldquo;{query}&rdquo;</> : null}</p>
            )}

            {rest.length ? (
                <ol className="j-list">
                    {rest.map((p) => (
                        <li key={p.slug}>
                            <Link href={`/blog/${p.slug}`}>
                                <span className="mono">{formatDate(p.date)}</span>
                                <div><h3>{p.title}</h3><p>{p.description}</p></div>
                                <span className="mono">{p.category} &middot; {p.readTime}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            ) : results.length ? null : (
                <div className="j-empty">
                    <p>Nothing matches that yet.</p>
                    <button type="button" className="j-chip mono" onClick={() => { setQuery(""); setCategory("All"); }}>Show all posts</button>
                </div>
            )}
        </main>
    );
}
