import { NextRequest, NextResponse } from "next/server";
import { readBlogs, updateBlog, deleteBlog } from "@/lib/blogUtils";
import { getCommentsBySlug } from "@/lib/commentUtils";

type Params = {
    params: Promise<{ slug: string }>;
};

// GET single blog
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const blogs = readBlogs();
        const blog = blogs.find(b => b.slug === slug);
        
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        
        // Merge comments from JSON
        const blogWithComments = {
            ...blog,
            comments: getCommentsBySlug(slug)
        };
        
        return NextResponse.json(blogWithComments);
    } catch (error) {
        console.error("Failed to fetch blog:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PUT update blog
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const data = await request.json();
        
        const updated = updateBlog(slug, data);

        if (!updated) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update blog:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

// DELETE blog
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;

        const deleted = deleteBlog(slug);

        if (!deleted) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete blog:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
