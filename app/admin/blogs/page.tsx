"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/admin/AuthGuard";
import { Blog, BlogComment } from "@/lib/types";
import StatsCard from "@/components/admin/StatsCard";
import PaginationControls from "@/components/admin/PaginationControls";
import { cn } from "@/lib/utils";
import { 
  Heart, MessageSquare, BookOpen, Search, 
  MoreVertical, Edit2, Trash2, CheckCircle2, 
  X, Filter, Download, Plus, ChevronRight
} from "lucide-react";

// Icons (Mirrored from Marble for structure but following IndiiServe style)
const BlogIcon = () => <BookOpen className="w-4 h-4" />;
const HeartIcon = () => <Heart className="w-4 h-4" />;
const CommentIcon = () => <MessageSquare className="w-4 h-4" />;
const SearchIcon = () => <Search className="w-4 h-4" />;

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [commentsModal, setCommentsModal] = useState<Blog | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/blogs");
            const data = await res.json();
            setBlogs(data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (id: string, slug: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        try {
            const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
            if (res.ok) {
                (window as any).showToast?.("Blog deleted successfully", "success");
                fetchBlogs();
            }
        } catch (error) {
            console.error("Delete error:", error);
            (window as any).showToast?.("Failed to delete blog", "error");
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} posts?`)) return;
        try {
            for (const id of selectedIds) {
                const blog = blogs.find(b => b.id === id);
                if (blog) {
                    await fetch(`/api/blogs/${blog.slug}`, { method: "DELETE" });
                }
            }
            setSelectedIds([]);
            (window as any).showToast?.(`${selectedIds.length} posts deleted`, "success");
            fetchBlogs();
        } catch (error) {
            console.error("Bulk delete error:", error);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        setSelectedIds(selectedIds.length === paginatedBlogs.length ? [] : paginatedBlogs.map(b => b.id));
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.author.toLowerCase().includes(search.toLowerCase()) ||
        blog.category.toLowerCase().includes(search.toLowerCase())
    );

    const totalItems = filteredBlogs.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-violet-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <AuthGuard requiredPermission="blogs">
            <main className="space-y-8 font-poppins animate-in fade-in duration-700 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold text-white tracking-tight">Blogs</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage blog posts and articles</p>
                    </div>
                    <Link
                        href="/admin/blogs/editor"
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-600/20 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> New Post
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatsCard 
                        title="Total Posts" 
                        value={blogs.length} 
                        icon={<BlogIcon />} 
                        iconBgColor="bg-indigo-500/10"
                        iconColor="text-indigo-400"
                    />
                    <StatsCard 
                        title="Total Likes" 
                        value={blogs.reduce((sum, b) => sum + b.likes, 0)} 
                        icon={<HeartIcon />} 
                        iconBgColor="bg-red-500/10"
                        iconColor="text-red-400"
                    />
                    <StatsCard 
                        title="Total Comments" 
                        value={blogs.reduce((sum, b) => sum + b.comments.length, 0)} 
                        icon={<CommentIcon />} 
                        iconBgColor="bg-blue-500/10"
                        iconColor="text-blue-400"
                    />
                </div>

                {/* Search & Actions */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <SearchIcon />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Filter by title, author or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 bg-white/[0.03] text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all font-sans"
                        />
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-red-400">{selectedIds.length} Selected</span>
                            <button
                                onClick={handleBulkDelete}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-red-600/20"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                            </button>
                        </div>
                        <button onClick={() => setSelectedIds([])} className="text-xs font-semibold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Clear</button>
                    </div>
                )}

                {/* Table Reversion (from Marble Site) */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="w-12 px-6 py-3">
                                        <input
                                            type="checkbox"
                                            checked={paginatedBlogs.length > 0 && selectedIds.length === paginatedBlogs.length}
                                            onChange={toggleAll}
                                            className="rounded border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500 h-4 w-4"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Post</th>
                                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Author</th>
                                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Likes</th>
                                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Comments</th>
                                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Published</th>
                                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedBlogs.map((blog) => (
                                    <tr key={blog.id} className={cn("hover:bg-white/[0.03] transition-colors group", selectedIds.includes(blog.id) && "bg-violet-500/5")}>
                                        <td className="px-6 py-2.5">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(blog.id)}
                                                onChange={() => toggleSelection(blog.id)}
                                                className="rounded border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500 h-4 w-4"
                                            />
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 bg-black/40">
                                                    {(blog.image || blog.coverImage) ? (
                                                        <img src={blog.image || blog.coverImage} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-700"><BookOpen className="w-5 h-5" /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-1">{blog.title}</div>
                                                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">By {blog.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5 font-poppins">
                                            <span className="inline-flex items-center rounded-full bg-violet-400/10 px-2.5 py-0.5 text-[9px] font-semibold border border-violet-400/20 text-violet-400 uppercase tracking-widest">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                                                <Heart className="w-3 h-3 text-red-500" /> {blog.likes}
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <button 
                                                onClick={() => setCommentsModal(blog)}
                                                className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors"
                                            >
                                                <MessageSquare className="w-3 h-3 text-blue-500" /> {blog.comments.length}
                                            </button>
                                        </td>
                                        <td className="px-6 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                                            {blog.date}
                                        </td>
                                        <td className="px-6 py-2.5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/blogs/editor?slug=${blog.slug}`}
                                                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                                    title="Edit Post"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteBlog(blog.id, blog.slug)}
                                                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                                    title="Delete Post"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedBlogs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-slate-500 font-semibold uppercase tracking-widest text-[10px]">
                                            No industrial logs found matching the filter
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-6 bg-white/[0.01] border-t border-white/5">
                        <PaginationControls 
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                            itemName="posts"
                        />
                    </div>
                </div>
            </main>

            {/* Comments Modal (Keeping present logic but matching IndiiServe theme) */}
            {commentsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setCommentsModal(null)} />
                    <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-white/10 bg-[#0c0c0c] shadow-2xl overflow-hidden font-poppins">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-semibold text-white">Discussion Thread</h3>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-1 line-clamp-1">{commentsModal.title}</p>
                            </div>
                            <button onClick={() => setCommentsModal(null)} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#080808]">
                            {commentsModal.comments.map((comment) => (
                                <div key={comment.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[11px] font-semibold text-white uppercase shadow-lg shadow-violet-500/20">{comment.name.charAt(0)}</div>
                                            <div>
                                                <div className="text-xs font-semibold text-white uppercase tracking-wider">{comment.name}</div>
                                                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">{new Date(comment.createdAt || comment.date || new Date()).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed pl-12">{comment.content}</p>
                                </div>
                            ))}
                            {commentsModal.comments.length === 0 && (
                                <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
                                    <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest">No active interaction threads found</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                            <button onClick={() => setCommentsModal(null)} className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/5 hover:text-white transition-all active:scale-[0.98]">Close Logs</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthGuard>
    );
}
