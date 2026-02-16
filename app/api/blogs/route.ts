import { NextRequest, NextResponse } from "next/server";
import { readBlogs, addBlog } from "@/lib/blogUtils";

// GET all blogs
export async function GET() {
    try {
        const blogs = readBlogs();
        return NextResponse.json(blogs);
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST create new blog
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        if (!data.title || !data.author || !data.content) {
            return NextResponse.json(
                { error: "Title, author and content are required" },
                { status: 400 }
            );
        }

        const newBlog = addBlog({
            title: data.title,
            slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            excerpt: data.excerpt || "",
            content: data.content,
            coverImage: data.image || data.coverImage || "/images/medcare.jpg",
            image: data.image || data.coverImage || "/images/medcare.jpg",
            author: data.author,
            category: data.category || "Technology",
            date: data.date || new Date().toISOString().split("T")[0],
            readTime: data.readTime || `${Math.ceil(data.content.length / 1000)} min read`
        });

        return NextResponse.json(newBlog, { status: 201 });
    } catch (error) {
        console.error("Failed to create blog:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
