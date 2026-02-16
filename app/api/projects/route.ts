import { NextRequest, NextResponse } from "next/server";
import { readProjects, addProject } from "@/lib/portfolioUtils";

// GET all projects
export async function GET() {
    const projects = readProjects();
    // Sort by displayOrder or order (support both IndiiServe/Marble)
    return NextResponse.json(projects.sort((a, b) => (a.displayOrder ?? a.order ?? 0) - (b.displayOrder ?? b.order ?? 0)));
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const newProject = addProject({
            title: data.title,
            category: data.category || "Other",
            description: data.description || "",
            image: data.image || "/images/medcare.jpg",
            tags: data.tags || [],
            gradient: data.gradient || "from-[#667eea] to-[#764ba2]",
            order: (readProjects().length + 1)
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Project creation error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
