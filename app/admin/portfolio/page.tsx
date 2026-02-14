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
        if (!confirm("Delete this case study from the showroom?")) return;
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
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Showcase Gallery</h1>
                        <p className="mt-1 text-sm font-medium text-zinc-500">Curate and organize your best work for the global audience.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-violet-900/20 hover:bg-violet-500 transition-all active:scale-95"
                    >
                        Add Exhibit
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4 bg-neutral-950 p-6 rounded-[1.5rem] border border-white/10">
                    <div className="relative flex-1 max-w-lg">
                        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter exhibits by title or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-white/5 bg-black pl-11 pr-4 py-3 text-sm font-medium text-zinc-200 placeholder-zinc-500 outline-none focus:border-violet-500 focus:bg-black transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* Exhibits Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((project, index) => (
                        <div
                            key={project.id}
                            className="group rounded-[2rem] border border-white/10 bg-neutral-950 overflow-hidden hover:border-violet-500/50 transition-all duration-500"
                        >
                            <div className="relative h-56 overflow-hidden bg-zinc-100">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                <div className="absolute top-4 left-4">
                                    <span className="bg-violet-500/10 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-violet-400 shadow-sm border border-violet-500/20">
                                        {project.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 h-8 w-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/20">
                                    {project.order}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight line-clamp-1">{project.title}</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-sm font-medium text-zinc-500 line-clamp-2 mb-6 min-h-[40px]">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mb-8 min-h-[28px]">
                                    {project.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-neutral-900 border border-white/5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest text-zinc-500"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 3 && (
                                        <span className="text-[9px] font-bold text-zinc-300 px-1">+{project.tags.length - 3}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => moveProject(project.id, "up")}
                                            disabled={index === 0}
                                            className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-neutral-900 text-zinc-400 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/10 disabled:opacity-20 transition-all shadow-sm"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveProject(project.id, "down")}
                                            disabled={index === filtered.length - 1}
                                            className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-neutral-900 text-zinc-400 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/10 disabled:opacity-20 transition-all shadow-sm"
                                        >
                                            ↓
                                        </button>
                                    </div>
                                    <div className="flex-1" />
                                    <button
                                        onClick={() => setEditProject(project)}
                                        className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-white/5 hover:border-rose-500/20"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-32 text-center rounded-[2.5rem] bg-black border-2 border-dashed border-white/5">
                        <p className="font-black uppercase tracking-[0.3em] text-zinc-700">No matching exhibits</p>
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 bg-neutral-950 p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <h2 className="mb-8 text-3xl font-black tracking-tight text-white uppercase">
                    {project ? "Modify Exhibit" : "New Exhibit"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="col-span-2">
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Exhibit Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none focus:border-violet-500 transition-all shadow-inner"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Core Classification</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none shadow-inner cursor-pointer hover:bg-neutral-900 transition-colors"
                            >
                                {categoryOptions.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Visual URL</label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Contextual Narrative</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-zinc-400 outline-none focus:border-violet-500 transition-all shadow-inner"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Descriptor Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tagOptions.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${selectedTags.includes(tag)
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                                        : "bg-neutral-900 text-zinc-500 border border-white/5 hover:bg-neutral-800"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full border border-white/10 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-full bg-violet-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-violet-600/20 hover:bg-violet-500 transition-all active:scale-95"
                        >
                            {project ? "Commit Changes" : "Publish Exhibit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
