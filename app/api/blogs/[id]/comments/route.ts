import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, insertOne } from "@/lib/db";

export interface Comment {
    id: string;
    blogId: string;
    name: string;
    email: string;
    content: string;
    createdAt: string;
}

type Params = { params: Promise<{ id: string }> };

// GET comments for a blog
export async function GET(request: NextRequest, { params }: Params) {
    const { id: blogId } = await params;
    const comments = readDb<Comment>("comments", []);
    const blogComments = comments.filter((c) => c.blogId === blogId);
    return NextResponse.json(blogComments);
}

// POST add comment to blog
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { id: blogId } = await params;
        const data = await request.json();

        const newComment: Comment = {
            id: Date.now().toString(),
            blogId,
            name: data.name || "Anonymous",
            email: data.email || "",
            content: data.content || "",
            createdAt: new Date().toISOString(),
        };

        insertOne("comments", newComment);

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

// DELETE comment from blog
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id: blogId } = await params;
        const { commentId } = await request.json();

        const comments = readDb<Comment>("comments", []);
        const filtered = comments.filter((c) => c.id !== commentId);

        if (filtered.length === comments.length) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        writeDb("comments", filtered);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
