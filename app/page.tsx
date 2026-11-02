import { getBlogPosts, fallbackPosts } from "@/lib/notion";
import HomeClient from "./_home/HomeClient";

export default async function Home() {
  // Latest four posts from Notion, or the static ones when Notion isn't configured
  let posts = await getBlogPosts();

  if (posts.length === 0) {
    posts = fallbackPosts;
  }

  return <HomeClient posts={posts.slice(0, 4)} />;
}

export const revalidate = 60;
