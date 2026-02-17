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
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
        );

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

    // Drag-and-drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Reorder locally first for instant feedback
        const newOrder = [...projects];
        const [moved] = newOrder.splice(startIndex + draggedIndex, 1);
        newOrder.splice(startIndex + dropIndex, 0, moved);
        setProjects(newOrder);
        setDraggedIndex(null);
        setDragOverIndex(null);

        try {
            const res = await fetch("/api/projects/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectIds: newOrder.map((p) => p.id) }),
            });
            const data = await res.json();
            setProjects(data);
            (window as any).showToast?.("Order updated", "success");
        } catch (error) {
            console.error("Failed to reorder:", error);
            await loadProjects();
            (window as any).showToast?.("Failed to reorder", "error");
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Selection handlers
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = (selectAll: boolean) => {
        setSelectedIds(selectAll ? paginatedData.map(p => p.id) : []);
    };

    const allSelected = paginatedData.length > 0 && paginatedData.every(p => selectedIds.includes(p.id));

    const bulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} selected projects?`)) return;
        try {
            for (const id of selectedIds) {
                await fetch(`/api/projects/${id}`, { method: "DELETE" });
            }
            setSelectedIds([]);
            await loadProjects();
            (window as any).showToast?.(`${selectedIds.length} projects deleted`, "info");
        } catch (error) {
            console.error("Bulk delete failed:", error);
            (window as any).showToast?.("Failed to delete selected", "error");
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
                        <h1 className="text-4xl font-semibold text-white tracking-tight">Portfolio</h1>
                        <p className="mt-1 text-[10px] font-semibold text-emerald-400/60 uppercase tracking-[0.4em]">Manage portfolio projects and case studies</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                            className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-sm font-medium text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all placeholder:text-slate-600 selection:bg-emerald-500/30"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Showcase Capacity: {paginatedData.length} of {totalItems} items</p>
                    <PaginationControls
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemName="exhibits"
                    />
                </div>

                {/* Bulk Actions Bar */}
                {selectedIds.length > 0 && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl px-5 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="text-sm font-semibold text-white">{selectedIds.length} selected</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <button
                                onClick={bulkDelete}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Selected
                            </button>
                        </div>
                        <button
                            className="text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
                            onClick={() => setSelectedIds([])}
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Content Table */}
                <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/[0.03] border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={(e) => toggleSelectAll(e.target.checked)}
                                            className="rounded border-slate-600 bg-white/[0.05] text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Project</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Category</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Order</th>
                                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {paginatedData.map((project, index) => (
                                    <tr
                                        key={project.id}
                                        draggable={!search}
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`group transition-all relative ${
                                            selectedIds.includes(project.id) ? 'bg-emerald-500/[0.04]' : 'hover:bg-white/[0.03]'
                                        } ${
                                            draggedIndex === index ? 'opacity-40' : ''
                                        } ${
                                            dragOverIndex === index ? 'border-t-2 border-emerald-500' : ''
                                        } ${
                                            !search ? 'cursor-grab active:cursor-grabbing' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-2.5 w-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(project.id)}
                                                onChange={() => toggleSelect(project.id)}
                                                className="rounded border-slate-600 bg-white/[0.05] text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-3">
                                                {!search && (
                                                    <div className="text-slate-600 hover:text-slate-400 flex-shrink-0">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="h-10 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                                    {project.type === 'video' ? (
                                                        <video src={project.preview || project.media} className="h-full w-full object-cover" muted playsInline />
                                                    ) : (
                                                        <img src={project.media} alt="" className="h-full w-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-white truncate max-w-[280px] text-sm tracking-tight">{project.title}</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {project.tags.slice(0, 3).map((tag) => (
                                                            <span key={tag} className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 rounded-lg border border-white/5">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {project.tags.length > 3 && <span className="text-[8px] font-semibold text-slate-600">+{project.tags.length - 3}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[9px] font-semibold text-emerald-400 uppercase tracking-[0.2em] border border-emerald-500/20">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className="text-xs font-semibold text-slate-500 tabular-nums">{project.order}</span>
                                        </td>
                                        <td className="px-6 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditProject(project)}
                                                    className="h-8 px-4 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-6 text-slate-600">
                                                <div className="h-24 w-24 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 text-4xl filter grayscale">🖼️</div>
                                                <p className="font-semibold uppercase tracking-[0.4em] text-[10px]">No exhibits found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
    const [media, setMedia] = useState(project?.media || "");
    const [type, setType] = useState<'video' | 'image'>(project?.type || "image");
    const [credits, setCredits] = useState(project?.credits || "");
    const [preview, setPreview] = useState(project?.preview || "");
    const [selectedTags, setSelectedTags] = useState<string[]>(project?.tags || []);
    const [isUploading, setIsUploading] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            (window as any).showToast?.("File too large. Maximum size: 5MB", "error");
            return;
        }

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
                setMedia(data.path);
                setPreview(data.path); // Use same for preview as default
                const isVideo = file.type.startsWith('video/');
                setType(isVideo ? 'video' : 'image');
                (window as any).showToast?.("Asset synchronized successfully", "success");
            } else {
                (window as any).showToast?.(data.error || "Upload failed", "error");
            }
        } catch (error) {
            console.error("Upload error:", error);
            (window as any).showToast?.("Failed to upload asset", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, category, description, media, type, credits, preview, tags: selectedTags }, !!project);
    };

    const inputClasses = "w-full rounded-2xl bg-white/[0.03] border border-white/5 px-6 py-4.5 text-sm font-medium text-white outline-none focus:border-emerald-500/40 focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder:text-slate-600 selection:bg-emerald-500/30";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 bg-[#030014]/90 backdrop-blur-2xl" onClick={onClose} />
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] border border-white/5 bg-[#030014] p-12 shadow-2xl animate-in fade-in zoom-in duration-500 no-scrollbar">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="flex justify-between items-center mb-10 relative z-10">
                    <div>
                        <h2 className="text-2xl font-semibold text-white uppercase tracking-tight">
                            {project ? "Edit Project" : "New Project"}
                        </h2>
                        <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-[0.4em] mt-2">Manage project details and case study</p>
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
                            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Project Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className={inputClasses}
                                placeholder="The Future of InDiiServe.ai"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Category</label>
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

                        <div>
                            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Type</label>
                            <div className="flex gap-2">
                                {(["image", "video"] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`flex-1 rounded-xl py-3 text-[10px] font-semibold uppercase tracking-widest border transition-all ${type === t ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-500'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Main Media (Max 5MB)</label>
                            <div className="space-y-4">
                                {media && (
                                    <div className="relative h-24 w-40 rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] group shadow-xl">
                                        {type === 'video' ? (
                                            <video src={media} className="h-full w-full object-cover" autoPlay loop muted playsInline />
                                        ) : (
                                            <img src={media} alt="" className="h-full w-full object-cover" />
                                        )}
                                        <button 
                                            type="button"
                                            onClick={() => setMedia("")}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <label className={`flex-1 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-500 cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                        {isUploading ? "Syncing..." : "Upload Source"}
                                        <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Compressed Preview</label>
                            <div className="space-y-4">
                                {preview && (
                                    <div className="relative h-24 w-40 rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] group shadow-xl">
                                        {type === 'video' ? (
                                            <video src={preview} className="h-full w-full object-cover" autoPlay loop muted playsInline />
                                        ) : (
                                            <img src={preview} alt="" className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                )}
                                <div className="text-[8px] text-slate-600 uppercase tracking-widest px-2">Automatically set to source. Upload a smaller version if needed.</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Credits</label>
                        <input
                            type="text"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                            required
                            className={inputClasses}
                            placeholder="Direction & Post-production — InDiiServe.ai"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Description</label>
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
                        <label className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 ml-1">Tags</label>
                        <div className="flex flex-wrap gap-3">
                            {tagOptions.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`rounded-2xl px-5 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] transition-all border ${selectedTags.includes(tag)
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
                            className="flex-1 rounded-[1.5rem] border border-white/5 bg-white/[0.03] py-4.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 hover:text-white hover:bg-white/5 transition-all shadow-xl"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 py-4.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {project ? "Save Changes" : "New Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
