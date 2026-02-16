import { NextRequest, NextResponse } from "next/server";
import { readProjects, addProject } from "@/lib/portfolioUtils";

// GET all projects
export async function GET() {
    try {
        const projects = readProjects();
        // Sort by displayOrder or order (support both IndiiServe/Marble)
        const sorted = projects.sort((a, b) => {
            const orderA = a.displayOrder ?? a.order ?? 0;
            const orderB = b.displayOrder ?? b.order ?? 0;
            return Number(orderA) - Number(orderB);
        });
        return NextResponse.json(sorted);
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

// POST create new project
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const newProject = addProject({
            title: data.title,
            category: data.category || "Other",
            description: data.description || "",
            credits: data.credits || "",
            media: data.media || "",
            type: data.type || "image",
            preview: data.preview || data.media || "",
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
