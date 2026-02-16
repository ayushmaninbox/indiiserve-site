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

        // Update displayOrder based on position in array
        const reordered = projects.map((project) => {
            const newOrder = projectIds.indexOf(project.id);
            return {
                ...project,
                displayOrder: newOrder !== -1 ? newOrder : project.displayOrder,
            };
        });

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
