import fs from "node:fs";
import path from "node:path";
import { getBlogPosts as getNotionPosts, getBlogPostBySlug as getNotionPost, type NotionBlock } from "./notion";

// Posts live as Markdown files in content/posts. Notion posts, when a database is configured, are merged in at build time.
const POSTS_DIR = path.join(process.cwd(), "content/posts");
export const SITE_URL = "https://alexanderdamore.com";
export const AUTHOR = {
    name: "Alexander D'Amore",
    role: "Senior marketing creative & MarTech strategist",
    url: SITE_URL,
    linkedin: "https://www.linkedin.com/in/alexdamore/",
    image: `${SITE_URL}/assets/images/headshot.webp`,
};
// The blog's brand, used in its titles, share cards, feed and structured data.
export const BLOG = {
    name: "The Snarky AI Marketer",
    tagline: "Practical AI, used the old-school marketing way.",
    description: "The Snarky AI Marketer is Alexander D'Amore's blog on using AI the practical, old-school way: briefs, positioning, customer research and CRM first, hype last.",
};

export interface PostSummary {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: string;
    tags: string[];
    featured: boolean;
    readTime: string;
}

export interface Post extends PostSummary {
    html: string;
    headings: { id: string; text: string }[];
    text: string;
}

// Lower-case body text sent to the blog index so search covers the whole post, not just the title.
export interface SearchablePost extends PostSummary {
    search: string;
}

function slugify(s: string): string {
    return s.toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s: string): string {
    return escapeHtml(s)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
            const external = /^https?:/.test(href) && !href.startsWith(SITE_URL);
            return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
        })
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

// A small Markdown subset: ## and ### headings, paragraphs, - and 1. lists, > quotes, and inline code, links, bold, italics.
function renderMarkdown(md: string) {
    const html: string[] = [];
    const headings: { id: string; text: string }[] = [];
    let para: string[] = [];
    let list: { tag: "ul" | "ol"; items: string[] } | null = null;
    let quote: string[] = [];

    const flush = () => {
        if (para.length) html.push(`<p>${inline(para.join(" "))}</p>`);
        if (list) html.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`);
        if (quote.length) html.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`);
        para = [];
        list = null;
        quote = [];
    };

    for (const raw of md.split("\n")) {
        const line = raw.trim();
        let m: RegExpMatchArray | null;
        if (!line) {
            flush();
        } else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
            flush();
            const text = m[2];
            const id = slugify(text);
            if (m[1].length === 2) headings.push({ id, text });
            html.push(`<h${m[1].length} id="${id}">${inline(text)}</h${m[1].length}>`);
        } else if ((m = line.match(/^(-|\d+\.)\s+(.*)$/))) {
            const tag = m[1] === "-" ? "ul" : "ol";
            if (para.length || quote.length || (list && list.tag !== tag)) flush();
            if (!list) list = { tag, items: [] };
            list.items.push(m[2]);
        } else if (line.startsWith(">")) {
            if (para.length || list) flush();
            quote.push(line.replace(/^>\s?/, ""));
        } else if (list && /^\s+/.test(raw)) {
            list.items[list.items.length - 1] += " " + line;
        } else {
            if (list || quote.length) flush();
            para.push(line);
        }
    }
    flush();
    return { html: html.join("\n"), headings };
}

function parseFile(file: string): Post {
    const source = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error(`Missing front matter in ${file}`);
    const meta: Record<string, string> = {};
    for (const line of match[1].split("\n")) {
        const i = line.indexOf(":");
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
    }
    const body = match[2];
    const { html, headings } = renderMarkdown(body);
    const text = body.replace(/[#>*`_[\]()-]/g, " ").replace(/\s+/g, " ").trim();
    const words = text.split(" ").length;
    return {
        slug: file.replace(/\.md$/, ""),
        title: meta.title,
        description: meta.description,
        date: meta.date,
        category: meta.category || "Blog",
        tags: (meta.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
        featured: meta.featured === "true",
        readTime: `${Math.max(1, Math.round(words / 230))} min`,
        html,
        headings,
        text,
    };
}

function notionText(block: NotionBlock): string {
    const data = block[block.type] as { rich_text?: { plain_text: string }[] } | undefined;
    return (data?.rich_text || []).map((t) => t.plain_text).join("");
}

function notionToMarkdown(blocks: NotionBlock[]): string {
    return blocks
        .map((b) => {
            const t = notionText(b);
            switch (b.type) {
                case "heading_1":
                case "heading_2": return `## ${t}`;
                case "heading_3": return `### ${t}`;
                case "bulleted_list_item": return `- ${t}`;
                case "numbered_list_item": return `1. ${t}`;
                case "quote": return `> ${t}`;
                default: return t;
            }
        })
        .join("\n\n")
        .replace(/^(- .*)\n\n(?=- )/gm, "$1\n")
        .replace(/^(1\. .*)\n\n(?=1\. )/gm, "$1\n");
}

let cache: Post[] | null = null;

function localPosts(): Post[] {
    if (!cache) {
        cache = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")).map(parseFile);
    }
    return cache;
}

function summary(p: Post): PostSummary {
    return { slug: p.slug, title: p.title, description: p.description, date: p.date, category: p.category, tags: p.tags, featured: p.featured, readTime: p.readTime };
}

export async function getAllPosts(): Promise<PostSummary[]> {
    const local = localPosts().map(summary);
    const taken = new Set(local.map((p) => p.slug));
    const notion = (await getNotionPosts())
        .filter((p) => !taken.has(p.slug))
        .map((p) => ({ slug: p.slug, title: p.title, description: p.excerpt, date: p.date, category: p.category, tags: [], featured: p.featured, readTime: p.readTime }));
    return [...local, ...notion].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getSearchablePosts(): Promise<SearchablePost[]> {
    const posts = await getAllPosts();
    const bodies = new Map(localPosts().map((p) => [p.slug, p.text]));
    return posts.map((p) => ({
        ...p,
        search: [p.title, p.description, p.category, p.tags.join(" "), bodies.get(p.slug) || ""].join(" ").toLowerCase(),
    }));
}

export async function getPost(slug: string): Promise<Post | null> {
    const local = localPosts().find((p) => p.slug === slug);
    if (local) return local;
    const n = await getNotionPost(slug);
    if (!n) return null;
    const { html, headings } = renderMarkdown(notionToMarkdown(n.content));
    return { slug: n.slug, title: n.title, description: n.excerpt, date: n.date, category: n.category, tags: [], featured: n.featured, readTime: n.readTime, html, headings, text: "" };
}

// Posts that share the most tags (then the category) with this one.
export async function getRelatedPosts(post: PostSummary, count = 3): Promise<PostSummary[]> {
    const all = (await getAllPosts()).filter((p) => p.slug !== post.slug);
    const score = (p: PostSummary) => p.tags.filter((t) => post.tags.includes(t)).length * 2 + (p.category === post.category ? 1 : 0);
    return all.map((p) => ({ p, s: score(p) })).sort((a, b) => b.s - a.s || b.p.date.localeCompare(a.p.date)).slice(0, count).map((x) => x.p);
}

export function formatDate(date: string): string {
    return new Date(date.slice(0, 10) + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
