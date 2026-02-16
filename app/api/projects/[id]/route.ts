import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/portfolioUtils";

type Params = { params: Promise<{ id: string }> };

// PUT update project
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await request.json();

        const updated = updateProject(id, data);

        if (!updated) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update project:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const deleted = deleteProject(id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete project:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
