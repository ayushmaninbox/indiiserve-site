import { NextRequest, NextResponse } from "next/server";
import { getCommentsBySlug, addCommentToSlug } from "@/lib/commentUtils";

type Params = {
    params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const comments = getCommentsBySlug(slug);
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const { name, content } = await request.json();

        if (!name || !content) {
            return NextResponse.json(
                { error: "Name and content are required" },
                { status: 400 }
            );
        }

        const newComment = addCommentToSlug(slug, { name: name.trim(), content: content.trim() });
        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Failed to post comment:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
