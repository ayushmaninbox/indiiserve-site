import { NextRequest, NextResponse } from "next/server";
import { readBlogs, updateBlog } from "@/lib/blogUtils";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const blogs = readBlogs();
        const blog = blogs.find(b => b.slug === slug);
        
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const { action } = await request.json(); // "like" or "unlike"
        const currentLikes = blog.likes || 0;
        const newLikes = action === "unlike" ? Math.max(0, currentLikes - 1) : currentLikes + 1;

        const updated = updateBlog(slug, { likes: newLikes });

        if (!updated) {
            return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
        }

        return NextResponse.json({ likes: updated.likes });
    } catch (error) {
        console.error("Failed to update likes:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
