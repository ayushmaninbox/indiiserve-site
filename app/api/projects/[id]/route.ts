import { NextRequest, NextResponse } from "next/server";
import { updateById, deleteById } from "@/lib/db";
import { Project } from "@/data/projects";

type Params = { params: Promise<{ id: string }> };

// PUT update project
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await request.json();

        const updated = updateById<Project>("projects", id, data);

        if (!updated) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
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

        const deleted = deleteById<Project>("projects", id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
