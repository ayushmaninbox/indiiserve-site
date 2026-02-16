"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/admin/AuthGuard";
import { Project } from "@/lib/types";
import { categoryOptions, tagOptions } from "@/lib/portfolioConstants";
import StatsCard from "@/components/admin/StatsCard";
import PaginationControls from "@/components/admin/PaginationControls";
import { cn } from "@/lib/utils";

// Icons
const BoxIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const SearchIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = projects
        .filter((p) =>
            search
                ? p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
                : true
        )
        .sort((a: Project, b: Project) => (a.order ?? 0) - (b.order ?? 0));

    const totalItems = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = filtered.slice(startIndex, endIndex);

    const saveProject = async (projectData: Partial<Project>, isEdit: boolean) => {
        try {
            if (isEdit && editProject) {
                await fetch(`/api/projects/${editProject.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(projectData),
                });
                (window as any).showToast?.("Exhibit details updated", "success");
            } else {
                await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(projectData),
                });
                (window as any).showToast?.("New exhibit published", "success");
            }
            await loadProjects();
            setEditProject(null);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to save project:", error);
            (window as any).showToast?.("Failed to save exhibit", "error");
        }
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Delete this case study from the showroom?")) return;
        try {
            await fetch(`/api/projects/${id}`, { method: "DELETE" });
            await loadProjects();
            (window as any).showToast?.("Exhibit removed", "info");
        } catch (error) {
            console.error("Failed to delete:", error);
            (window as any).showToast?.("Failed to remove exhibit", "error");
        }
    };

    const moveProject = async (id: string, direction: "up" | "down") => {
        const index = projects.findIndex((p) => p.id === id);
        if (index === -1) return;
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === projects.length - 1) return;

        const newOrder = [...projects];
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];

        try {
            await fetch("/api/projects/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectIds: newOrder.map((p) => p.id) }),
            });
            await loadProjects();
            (window as any).showToast?.("Showcase order updated", "success");
        } catch (error) {
            console.error("Failed to reorder:", error);
            (window as any).showToast?.("Failed to reorder exhibits", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <AuthGuard requiredPermission="portfolio">
            <div className="space-y-10 animate-in fade-in duration-700 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight italic">Portfolio</h1>
                        <p className="mt-1 text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.4em]">Manage portfolio projects and case studies</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        + New Project
                    </button>
                </div>

                {/* HUD */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard 
                        title="Total Projects" 
                        value={projects.length} 
                        icon={<BoxIcon />} 
                        iconBgColor="bg-emerald-500/10"
                        iconColor="text-emerald-400"
                        trend={{ text: "Active", color: "text-emerald-500/60" }}
                    />
                </div>

                {/* Toolbar */}
                <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-4 backdrop-blur-3xl shadow-2xl">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Filter exhibits by title, category, or implementation stack..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-sm font-bold text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all placeholder:text-slate-600 selection:bg-emerald-500/30"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Showcase Capacity: {paginatedData.length} of {totalItems} items</p>
                    <PaginationControls
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemName="exhibits"
                    />
                </div>

                {/* Content Table */}
                <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/[0.03] border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Project</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Category</th>
                                    <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Order</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {paginatedData.map((project, index) => (
                                    <tr key={project.id} className="group hover:bg-white/[0.03] transition-all relative">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="h-14 w-24 flex-shrink-0 rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-700">
                                                    <img src={project.image} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-white truncate max-w-[280px] text-base tracking-tight italic">{project.title}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {project.tags.slice(0, 3).map((tag) => (
                                                            <span key={tag} className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 rounded-lg border border-white/5">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {project.tags.length > 3 && <span className="text-[8px] font-black text-slate-600">+{project.tags.length - 3}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => moveProject(project.id, "up")}
                                                    disabled={startIndex + index === 0}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-5 transition-all shadow-xl"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                                                </button>
                                                <span className="text-xs font-black text-slate-500 w-6 text-center tabular-nums">{project.order}</span>
                                                <button
                                                    onClick={() => moveProject(project.id, "down")}
                                                    disabled={startIndex + index === projects.length - 1}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-5 transition-all shadow-xl"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => setEditProject(project)}
                                                    className="h-10 px-5 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl"
                                                >
                                                    Refine
                                                </button>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-xl"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-6 text-slate-600">
                                                <div className="h-24 w-24 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 text-4xl filter grayscale">🖼️</div>
                                                <p className="font-black uppercase tracking-[0.4em] text-[10px]">No exhibits detected in this sector</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pt-6 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.02] border border-white/5">
                        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Portfolio Showcase Terminal Active</p>
                    </div>
                </div>
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
    const [image, setImage] = useState(project?.image || "");
    const [selectedTags, setSelectedTags] = useState<string[]>(project?.tags || []);
    const [isUploading, setIsUploading] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setImage(data.path);
                (window as any).showToast?.("Image asset synchronized successfully", "success");
            } else {
                (window as any).showToast?.(data.error || "Upload failed", "error");
            }
        } catch (error) {
            console.error("Upload error:", error);
            (window as any).showToast?.("Failed to upload image asset", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, category, description, image, tags: selectedTags }, !!project);
    };

    const inputClasses = "w-full rounded-2xl bg-white/[0.03] border border-white/5 px-6 py-4.5 text-sm font-bold text-white outline-none focus:border-emerald-500/40 focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder:text-slate-600 selection:bg-emerald-500/30";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 bg-[#030014]/90 backdrop-blur-2xl" onClick={onClose} />
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] border border-white/5 bg-[#030014] p-12 shadow-2xl animate-in fade-in zoom-in duration-500 no-scrollbar">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="flex justify-between items-center mb-10 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
                            {project ? "Edit Project" : "New Project"}
                        </h2>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-2">Manage project details and case study</p>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 rounded-2xl border border-white/5 bg-white/[0.03] text-slate-500 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all shadow-xl">
                         <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid gap-8 sm:grid-cols-2">
                        <div className="col-span-2">
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Project Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className={inputClasses}
                                placeholder="The Future of IndiiServe"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={cn(inputClasses, "cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234b5563%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19%209-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_1.5rem_center] bg-no-repeat uppercase text-[11px] tracking-widest")}
                            >
                                {categoryOptions.map((cat) => (
                                    <option key={cat} value={cat} className="bg-[#030014]">{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Image Asset</label>
                            <div className="space-y-4">
                                {image && (
                                    <div className="relative h-24 w-40 rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] group shadow-xl">
                                        <img src={image} alt="" className="h-full w-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => setImage("")}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <label className={`flex-1 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                        {isUploading ? "Syncing..." : "Upload Source"}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className={cn(inputClasses, "resize-none font-medium text-slate-400")}
                            placeholder="Provide deep architectural context for this exhibit..."
                        />
                    </div>

                    <div>
                        <label className="mb-4 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Tags</label>
                        <div className="flex flex-wrap gap-3">
                            {tagOptions.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`rounded-2xl px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${selectedTags.includes(tag)
                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105"
                                        : "bg-white/[0.03] text-slate-500 border-white/5 hover:border-emerald-500/30 hover:text-emerald-400"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-[1.5rem] border border-white/5 bg-white/[0.03] py-4.5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-white hover:bg-white/5 transition-all shadow-xl"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 py-4.5 text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {project ? "Save Changes" : "New Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
