import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

interface Like {
    blogId: string;
    count: number;
}

type Params = { params: Promise<{ id: string }> };

// GET like count for a blog
export async function GET(request: NextRequest, { params }: Params) {
    const { id: blogId } = await params;
    const likes = readDb<Like>("likes", []);
    const blogLike = likes.find((l) => l.blogId === blogId);
    return NextResponse.json({ count: blogLike?.count || 0 });
}

// POST increment like count
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { id: blogId } = await params;

        const likes = readDb<Like>("likes", []);
        const existingIndex = likes.findIndex((l) => l.blogId === blogId);

        if (existingIndex !== -1) {
            likes[existingIndex].count += 1;
        } else {
            likes.push({ blogId, count: 1 });
        }

        writeDb("likes", likes);

        const newCount = existingIndex !== -1
            ? likes[existingIndex].count
            : 1;

        return NextResponse.json({ count: newCount });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
