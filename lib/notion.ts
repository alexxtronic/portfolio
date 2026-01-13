import { Client } from "@notionhq/client";

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_BLOG_DATABASE_ID || "";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    featured: boolean;
    published: boolean;
}

export interface BlogPostWithContent extends BlogPost {
    content: NotionBlock[];
}

// Type for Notion blocks
export interface NotionBlock {
    id: string;
    type: string;
    [key: string]: unknown;
}

// Helper to extract text from Notion rich text
function getRichText(richText: { plain_text: string }[] | undefined): string {
    if (!richText || !Array.isArray(richText)) return "";
    return richText.map((t) => t.plain_text).join("");
}

// Type for a page with properties
interface NotionPage {
    id: string;
    properties: Record<string, unknown>;
}

// Check if result is a page with properties
function isPageWithProperties(result: unknown): result is NotionPage {
    return (
        typeof result === "object" &&
        result !== null &&
        "id" in result &&
        "properties" in result
    );
}

// Fetch all published blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    // If no database ID, return empty array
    if (!databaseId) {
        return [];
    }

    try {
        // Use dataSources.query for v5.x of the Notion client
        const response = await notion.dataSources.query({
            data_source_id: databaseId,
            filter: {
                property: "Published",
                checkbox: {
                    equals: true,
                },
            },
            sorts: [
                {
                    property: "Date",
                    direction: "descending",
                },
            ],
        });

        // Cast to unknown first, then filter to pages with properties
        const results = response.results as unknown[];
        const pages = results.filter(isPageWithProperties);

        return pages.map((page) => {
            const props = page.properties;

            // Extract properties with safe fallbacks
            const slugProp = props.Slug as { rich_text?: { plain_text: string }[] } | undefined;
            const titleProp = props.Title as { title?: { plain_text: string }[] } | undefined;
            const excerptProp = props.Excerpt as { rich_text?: { plain_text: string }[] } | undefined;
            const categoryProp = props.Category as { select?: { name: string } | null } | undefined;
            const dateProp = props.Date as { date?: { start: string } | null } | undefined;
            const readTimeProp = props["Read Time"] as { rich_text?: { plain_text: string }[] } | undefined;
            const featuredProp = props.Featured as { checkbox?: boolean } | undefined;
            const publishedProp = props.Published as { checkbox?: boolean } | undefined;

            return {
                id: page.id,
                slug: getRichText(slugProp?.rich_text) || page.id,
                title: getRichText(titleProp?.title) || "Untitled",
                excerpt: getRichText(excerptProp?.rich_text) || "",
                category: categoryProp?.select?.name || "General",
                date: dateProp?.date?.start || new Date().toISOString().split("T")[0],
                readTime: getRichText(readTimeProp?.rich_text) || "5 min",
                featured: featuredProp?.checkbox || false,
                published: publishedProp?.checkbox || false,
            };
        });
    } catch (error) {
        console.error("Error fetching blog posts from Notion:", error);
        return [];
    }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
    if (!databaseId) {
        return null;
    }

    try {
        const response = await notion.dataSources.query({
            data_source_id: databaseId,
            filter: {
                and: [
                    {
                        property: "Slug",
                        rich_text: {
                            equals: slug,
                        },
                    },
                    {
                        property: "Published",
                        checkbox: {
                            equals: true,
                        },
                    },
                ],
            },
        });

        // Cast to unknown first, then filter
        const results = response.results as unknown[];
        const pages = results.filter(isPageWithProperties);

        if (pages.length === 0) {
            return null;
        }

        const page = pages[0];
        const props = page.properties;

        // Fetch page content (blocks)
        const blocksResponse = await notion.blocks.children.list({
            block_id: page.id,
        });

        // Extract properties with safe fallbacks
        const slugProp = props.Slug as { rich_text?: { plain_text: string }[] } | undefined;
        const titleProp = props.Title as { title?: { plain_text: string }[] } | undefined;
        const excerptProp = props.Excerpt as { rich_text?: { plain_text: string }[] } | undefined;
        const categoryProp = props.Category as { select?: { name: string } | null } | undefined;
        const dateProp = props.Date as { date?: { start: string } | null } | undefined;
        const readTimeProp = props["Read Time"] as { rich_text?: { plain_text: string }[] } | undefined;
        const featuredProp = props.Featured as { checkbox?: boolean } | undefined;
        const publishedProp = props.Published as { checkbox?: boolean } | undefined;

        return {
            id: page.id,
            slug: getRichText(slugProp?.rich_text) || page.id,
            title: getRichText(titleProp?.title) || "Untitled",
            excerpt: getRichText(excerptProp?.rich_text) || "",
            category: categoryProp?.select?.name || "General",
            date: dateProp?.date?.start || new Date().toISOString().split("T")[0],
            readTime: getRichText(readTimeProp?.rich_text) || "5 min",
            featured: featuredProp?.checkbox || false,
            published: publishedProp?.checkbox || false,
            content: blocksResponse.results as NotionBlock[],
        };
    } catch (error) {
        console.error("Error fetching blog post from Notion:", error);
        return null;
    }
}

// Get all slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
    const posts = await getBlogPosts();
    return posts.map((post) => post.slug);
}

// Static fallback blog posts (when Notion is not configured)
const staticPosts: BlogPostWithContent[] = [
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
        content: [
            { id: "1", type: "paragraph", paragraph: { rich_text: [{ plain_text: "The term 'agentic AI' has become the latest buzzword in marketing technology, but beneath the hype lies a genuinely transformative approach to automation. After spending the past year building and deploying multi-agent systems for enterprise clients, I've learned what works, what doesn't, and where the real value lies." }] } },
            { id: "2", type: "heading_2", heading_2: { rich_text: [{ plain_text: "What Makes an AI Agent 'Agentic'?" }] } },
            { id: "3", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Traditional automation follows predefined rules: if X happens, do Y. Agentic systems take a different approach—they're given goals and constraints, then figure out the best path forward. This might sound subtle, but the implications are massive." }] } },
            { id: "4", type: "heading_2", heading_2: { rich_text: [{ plain_text: "Real-World Applications" }] } },
            { id: "5", type: "paragraph", paragraph: { rich_text: [{ plain_text: "In practice, I've deployed agentic systems for lead qualification, content personalization, and campaign optimization. The key insight: agents excel at tasks that require judgment calls based on partial information—exactly the kind of work that eats up marketing team bandwidth." }] } },
            { id: "6", type: "heading_2", heading_2: { rich_text: [{ plain_text: "Getting Started" }] } },
            { id: "7", type: "paragraph", paragraph: { rich_text: [{ plain_text: "If you're considering agentic automation, start small. Pick one repetitive task that requires some judgment—like categorizing inbound leads or drafting initial email responses—and build from there. The technology is ready; the question is whether your processes are." }] } },
        ],
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
        content: [
            { id: "1", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Enterprise CRM migrations are notoriously painful. Data gets lost, integrations break, and teams spend months recovering. Having led multiple HubSpot Enterprise migrations, I've developed a methodology that minimizes risk and maximizes success." }] } },
            { id: "2", type: "heading_2", heading_2: { rich_text: [{ plain_text: "Phase 1: Audit Everything" }] } },
            { id: "3", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Before touching any data, create a complete inventory of your current state: all properties, workflows, integrations, and customizations. This audit becomes your migration checklist and your rollback reference." }] } },
            { id: "4", type: "heading_2", heading_2: { rich_text: [{ plain_text: "Phase 2: Data Architecture" }] } },
            { id: "5", type: "paragraph", paragraph: { rich_text: [{ plain_text: "HubSpot Enterprise offers powerful customization options, but this is where many migrations go wrong. Resist the urge to replicate your old structure exactly. Instead, design for how you want to work, not how you've always worked." }] } },
            { id: "6", type: "heading_2", heading_2: { rich_text: [{ plain_text: "Phase 3: Execute and Validate" }] } },
            { id: "7", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Run your migration in stages with validation checkpoints. I use a '10-100-1000' approach: migrate 10 records, validate everything, then 100, then 1000, scaling up only when each stage passes inspection." }] } },
        ],
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
        content: [
            { id: "1", type: "paragraph", paragraph: { rich_text: [{ plain_text: "I've built production workflows on Zapier, Make (formerly Integromat), and n8n. Each has passionate advocates.  the truth is more nuanced than 'X is best.' The right choice depends on your specific context." }] } },
            { id: "2", type: "heading_2", heading_2: { rich_text: [{ plain_text: "Zapier: The Reliable Standard" }] } },
            { id: "3", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Zapier remains the easiest to use and has the widest integration library. For straightforward automation needs and non-technical users, it's hard to beat. The downside: costs scale quickly for high-volume workflows." }] } },
            { id: "4", type: "heading_2", heading_2: { rich_text: [{ plain_text: "Make: The Power User's Choice" }] } },
            { id: "5", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Make offers more sophisticated data manipulation and branching logic at a lower price point. The visual builder takes getting used to, but once you understand it, you can build surprisingly complex workflows." }] } },
            { id: "6", type: "heading_2", heading_2: { rich_text: [{ plain_text: "n8n: The Developer's Dream" }] } },
            { id: "7", type: "paragraph", paragraph: { rich_text: [{ plain_text: "n8n is self-hostable, open-core, and incredibly flexible. If you have technical resources and want full control, n8n delivers. I use it for workflows that need custom code execution or tight integration with internal systems." }] } },
        ],
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
        content: [
            { id: "1", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Everyone wants to talk about AI in marketing. Few want to talk about what's actually working versus what's just impressive in demos. After implementing AI across dozens of marketing operations, here's my honest assessment." }] } },
            { id: "2", type: "heading_2", heading_2: { rich_text: [{ plain_text: "What's Working: Content Assistance" }] } },
            { id: "3", type: "paragraph", paragraph: { rich_text: [{ plain_text: "AI as a writing partner—not a writer—is genuinely valuable. First drafts, outline generation, and copy variations are all areas where AI saves significant time without sacrificing quality." }] } },
            { id: "4", type: "heading_2", heading_2: { rich_text: [{ plain_text: "What's Working: Data Analysis" }] } },
            { id: "5", type: "paragraph", paragraph: { rich_text: [{ plain_text: "AI excels at pattern recognition in large datasets. Anomaly detection in campaign performance, customer segmentation, and predictive lead scoring all benefit from AI assistance." }] } },
            { id: "6", type: "heading_2", heading_2: { rich_text: [{ plain_text: "What's Overhyped: Fully Autonomous Campaigns" }] } },
            { id: "7", type: "paragraph", paragraph: { rich_text: [{ plain_text: "The dream of 'set it and forget it' AI marketing remains mostly that—a dream. Human oversight, strategic direction, and quality control remain essential. The best results come from AI augmentation, not replacement." }] } },
        ],
    },
];

// Get static post slugs
export function getStaticPostSlugs(): string[] {
    return staticPosts.map((post) => post.slug);
}

// Get a static blog post by slug
export function getStaticBlogPost(slug: string): BlogPostWithContent | null {
    return staticPosts.find((post) => post.slug === slug) || null;
}

