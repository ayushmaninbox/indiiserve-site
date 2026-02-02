import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, insertOne } from "@/lib/db";
import { Project, defaultProjects } from "@/data/projects";

// GET all projects
export async function GET() {
    const projects = readDb<Project>("projects", defaultProjects);
    return NextResponse.json(projects.sort((a, b) => a.order - b.order));
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const projects = readDb<Project>("projects", defaultProjects);

        const newProject: Project = {
            id: Date.now().toString(),
            title: data.title,
            category: data.category || "Other",
            description: data.description || "",
            gradient: data.gradient || "from-[#667eea] to-[#764ba2]",
            image: data.image || "/images/medcare.jpg",
            tags: data.tags || [],
            order: projects.length + 1,
        };

        insertOne("projects", newProject);

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
