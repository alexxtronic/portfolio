import { getAllPosts } from "@/lib/blog";
import HomeClient from "./_home/HomeClient";

export default async function Home() {
    const posts = await getAllPosts();
    return <HomeClient posts={posts.slice(0, 4)} />;
}
