import { NextRequest, NextResponse } from "next/server";
import { readProjects, writeProjects } from "@/lib/portfolioUtils";

// PUT reorder projects
export async function PUT(request: NextRequest) {
    try {
        const { projectIds } = await request.json();

        if (!Array.isArray(projectIds)) {
            return NextResponse.json(
                { error: "projectIds must be an array" },
                { status: 400 }
            );
        }

        const projects = readProjects();

        // Sort projects by the order of IDs provided by the frontend
        const sorted = projectIds
            .map(id => projects.find(p => String(p.id) === String(id)))
            .filter((p): p is any => !!p);

        // Re-assign sequential IDs and orders
        const reordered = sorted.map((project, index) => ({
            ...project,
            id: (index + 1).toString(),
            order: index + 1,
            displayOrder: index + 1,
        }));

        writeProjects(reordered);

        return NextResponse.json(reordered.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
    } catch (error) {
        console.error("Reorder error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
