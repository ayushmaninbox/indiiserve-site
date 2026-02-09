"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/admin/AuthGuard";
import { blogs, BlogPost } from "@/data/blogs";

interface Comment {
    id: string;
    name: string;
    content: string;
    date: string;
}

interface BlogWithStats extends BlogPost {
    likes: number;
    comments: Comment[];
}

export default function BlogsPage() {
    const [blogsWithStats, setBlogsWithStats] = useState<BlogWithStats[]>([]);
    const [search, setSearch] = useState("");
    const [commentsModal, setCommentsModal] = useState<BlogWithStats | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        loadBlogStats();
    }, []);

    const loadBlogStats = () => {
        const data: BlogWithStats[] = blogs.map((blog) => {
            const likes = parseInt(localStorage.getItem(`blog-likes-${blog.slug}`) || "0", 10);
            const comments = JSON.parse(localStorage.getItem(`blog-comments-${blog.slug}`) || "[]");
            return { ...blog, likes, comments };
        });
        setBlogsWithStats(data);
    };

    const filtered = blogsWithStats.filter((b) =>
        search
            ? b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase())
            : true
    );

    const totalLikes = blogsWithStats.reduce((acc, b) => acc + b.likes, 0);
    const totalComments = blogsWithStats.reduce((acc, b) => acc + b.comments.length, 0);

    const paginatedData = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    const deleteBlog = (slug: string) => {
        if (!confirm("Clear all interactions for this blog?")) return;
        localStorage.removeItem(`blog-likes-${slug}`);
        localStorage.removeItem(`blog-comments-${slug}`);
        alert("Interactions cleared. To delete the post itself, remove it from /data/blogs.ts");
        loadBlogStats();
    };

    const deleteComment = (blogSlug: string, commentId: string) => {
        const comments = JSON.parse(localStorage.getItem(`blog-comments-${blogSlug}`) || "[]");
        const updated = comments.filter((c: Comment) => c.id !== commentId);
        localStorage.setItem(`blog-comments-${blogSlug}`, JSON.stringify(updated));
        loadBlogStats();
        if (commentsModal) {
            setCommentsModal({ ...commentsModal, comments: updated });
        }
    };

    const exportToCSV = () => {
        const data = blogsWithStats.map((b) => ({
            Title: b.title,
            Author: b.author,
            Category: b.category,
            Likes: b.likes,
            Comments: b.comments.length,
            Date: b.date,
        }));

        const headers = ["Title", "Author", "Category", "Likes", "Comments", "Date"];
        const csv = [
            headers.join(","),
            ...data.map((row) =>
                [row.Title, row.Author, row.Category, row.Likes, row.Comments, row.Date]
                    .map((val) => `"${String(val).replace(/"/g, '""')}"`)
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "editorial_stats.csv";
        a.click();
    };

    return (
        <AuthGuard requiredPermission="blogs">
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Editorial Manager</h1>
                        <p className="mt-1 text-sm font-medium text-zinc-500">Manage your stories, insights, and reader engagement.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
                        >
                            Export Stats
                        </button>
                        <Link
                            href="/admin/blogs/editor"
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-zinc-900/20 hover:bg-zinc-800 transition-all active:scale-95"
                        >
                            Create Post
                        </Link>
                    </div>
                </div>

                {/* Performance HUD */}
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Publications</p>
                                <p className="mt-2 text-3xl font-bold text-zinc-900">{blogsWithStats.length}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 italic font-black">
                                B
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Engagement Score</p>
                                <p className="mt-2 text-3xl font-bold text-rose-600 leading-none flex items-center gap-2">
                                    {totalLikes}
                                    <span className="text-xs font-medium text-rose-400 uppercase tracking-tighter">Reacts</span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Active Discussions</p>
                                <p className="mt-2 text-3xl font-bold text-sky-600 leading-none flex items-center gap-2">
                                    {totalComments}
                                    <span className="text-xs font-medium text-sky-400 uppercase tracking-tighter">Posts</span>
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4 bg-white p-6 rounded-[1.5rem] border border-zinc-200 shadow-sm">
                    <div className="relative flex-1">
                        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search stories by title or author keywords..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-zinc-100 bg-zinc-50 pl-11 pr-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* Content Table */}
                <div className="rounded-[2rem] border border-zinc-200 bg-white overflow-hidden shadow-xl shadow-zinc-200/10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Production Layer</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Lead Author</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Metrics</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Release Date</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Control Hub</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {paginatedData.map((blog) => (
                                    <tr key={blog.slug} className="group hover:bg-zinc-50/50 transition-all duration-300">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm relative">
                                                    <img src={blog.image} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-zinc-900 truncate max-w-[280px] text-base leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{blog.title}</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 border border-zinc-200">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-bold text-zinc-600 text-sm tracking-tight">{blog.author}</td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-[10px] font-bold text-rose-600 border border-rose-100 shadow-sm">
                                                    ❤️ {blog.likes}
                                                </span>
                                                <button
                                                    onClick={() => setCommentsModal(blog)}
                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-[10px] font-bold text-sky-600 border border-sky-100 shadow-sm hover:bg-sky-100 transition-colors"
                                                >
                                                    💬 {blog.comments.length}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-[11px] font-bold text-zinc-400 uppercase tracking-tight">{blog.date}</td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/admin/blogs/editor?slug=${blog.slug}`}
                                                    className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-xs font-bold uppercase tracking-widest text-zinc-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                                >
                                                    Modify
                                                </Link>
                                                <button
                                                    onClick={() => deleteBlog(blog.slug)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center justify-center text-zinc-300">
                                                <p className="font-black uppercase tracking-[0.3em] text-xs">Zero Stories Captured</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Hub */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-6 pt-6">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Library Page</span>
                             <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-600/30">{page}</span>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">of {totalPages}</span>
                        </div>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Discourse Panel */}
            {commentsModal && (
                <CommentsModal
                    blog={commentsModal}
                    onClose={() => setCommentsModal(null)}
                    onDeleteComment={(commentId) => deleteComment(commentsModal.slug, commentId)}
                />
            )}
        </AuthGuard>
    );
}

function CommentsModal({
    blog,
    onClose,
    onDeleteComment,
}: {
    blog: BlogWithStats;
    onClose: () => void;
    onDeleteComment: (commentId: string) => void;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm shadow-inner" onClick={onClose} />
            <div className="relative w-full max-w-xl max-h-[85vh] overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
                <div className="p-8 border-b border-zinc-100 bg-white sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Discourse Hub</h2>
                    <p className="mt-1 text-sm font-bold text-indigo-600 uppercase tracking-widest truncate">{blog.title}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {blog.comments.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="font-black uppercase tracking-[0.2em] text-xs text-zinc-300">No active discussions</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {blog.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="group rounded-2xl border border-zinc-100 bg-zinc-50 p-6 transition-all hover:bg-white hover:border-zinc-200 hover:shadow-md"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-600/20">
                                                {comment.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 tracking-tight">{comment.name}</p>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">{comment.date}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onDeleteComment(comment.id)}
                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-zinc-600">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="p-8 border-t border-zinc-100 bg-zinc-50/50">
                    <button
                        onClick={onClose}
                        className="w-full rounded-2xl bg-zinc-900 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-zinc-900/20 hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        Return to Library
                    </button>
                </div>
            </div>
        </div>
    );
}
