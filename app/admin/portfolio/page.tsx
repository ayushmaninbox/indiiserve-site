"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/admin/AuthGuard";
import { Project, categoryOptions, tagOptions } from "@/data/projects";

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects:", error);
        }
    };

    const filtered = projects
        .filter((p) =>
            search
                ? p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
                : true
        )
        .sort((a, b) => a.order - b.order);

    const saveProject = async (projectData: Partial<Project>, isEdit: boolean) => {
        try {
            if (isEdit && editProject) {
                await fetch(`/api/projects/${editProject.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(projectData),
                });
            } else {
                await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(projectData),
                });
            }
            await loadProjects();
            setEditProject(null);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to save project:", error);
        }
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        try {
            await fetch(`/api/projects/${id}`, { method: "DELETE" });
            await loadProjects();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const moveProject = async (id: string, direction: "up" | "down") => {
        const index = filtered.findIndex((p) => p.id === id);
        if (index === -1) return;
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === filtered.length - 1) return;

        const newOrder = [...filtered];
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];

        try {
            await fetch("/api/projects/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectIds: newOrder.map((p) => p.id) }),
            });
            await loadProjects();
        } catch (error) {
            console.error("Failed to reorder:", error);
        }
    };

    return (
        <AuthGuard requiredPermission="portfolio">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Portfolio / Works</h1>
                        <p className="mt-1 text-neutral-400">Manage featured projects on the homepage</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-300 transition-all"
                    >
                        + Add Project
                    </button>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by title or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-lime-400/50"
                />

                {/* Projects Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((project, index) => (
                        <div
                            key={project.id}
                            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                        >
                            <div className="relative h-40">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                                    {project.category}
                                </div>
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white">
                                    #{project.order}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                                <p className="text-sm text-neutral-400 line-clamp-2 mb-3">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {project.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-lime-400/10 px-2 py-0.5 rounded text-xs text-lime-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => moveProject(project.id, "up")}
                                        disabled={index === 0}
                                        className="rounded-lg border border-white/10 p-2 text-neutral-400 hover:text-white disabled:opacity-30"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveProject(project.id, "down")}
                                        disabled={index === filtered.length - 1}
                                        className="rounded-lg border border-white/10 p-2 text-neutral-400 hover:text-white disabled:opacity-30"
                                    >
                                        ↓
                                    </button>
                                    <div className="flex-1" />
                                    <button
                                        onClick={() => setEditProject(project)}
                                        className="text-lime-400 hover:underline text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="text-red-400 hover:underline text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                        <p className="text-neutral-500">No projects found</p>
                    </div>
                )}
            </div>

            {(isAddModalOpen || editProject) && (
                <ProjectModal
                    project={editProject}
                    onClose={() => {
                        setEditProject(null);
                        setIsAddModalOpen(false);
                    }}
                    onSave={saveProject}
                />
            )}
        </AuthGuard>
    );
}

function ProjectModal({
    project,
    onClose,
    onSave,
}: {
    project: Project | null;
    onClose: () => void;
    onSave: (data: Partial<Project>, isEdit: boolean) => void;
}) {
    const [title, setTitle] = useState(project?.title || "");
    const [category, setCategory] = useState(project?.category || "Other");
    const [description, setDescription] = useState(project?.description || "");
    const [image, setImage] = useState(project?.image || "/images/medcare.jpg");
    const [selectedTags, setSelectedTags] = useState<string[]>(project?.tags || []);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, category, description, image, tags: selectedTags }, !!project);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-6">
                <h2 className="mb-6 text-xl font-bold text-white">
                    {project ? "Edit Project" : "Add Project"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-400/50"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                        >
                            {categoryOptions.map((cat) => (
                                <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-400/50"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Image URL</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-400/50"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tagOptions.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedTags.includes(tag)
                                            ? "bg-lime-400 text-black"
                                            : "bg-white/10 text-neutral-400 hover:bg-white/20"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full border border-white/10 py-3 font-medium text-white hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-full bg-lime-400 py-3 font-bold text-black hover:bg-lime-300"
                        >
                            {project ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
