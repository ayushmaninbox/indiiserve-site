import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { Project, defaultProjects } from "@/data/projects";

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

        const projects = readDb<Project>("projects", defaultProjects);

        // Update order based on position in array
        const reordered = projects.map((project) => {
            const newOrder = projectIds.indexOf(project.id);
            return {
                ...project,
                order: newOrder !== -1 ? newOrder + 1 : project.order,
            };
        });

        writeDb("projects", reordered);

        return NextResponse.json(reordered.sort((a, b) => a.order - b.order));
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
