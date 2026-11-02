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
