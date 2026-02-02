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
    const [selected, setSelected] = useState<string[]>([]);
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
        if (!confirm("Delete this blog post?")) return;
        // Remove from localStorage comments and likes
        localStorage.removeItem(`blog-likes-${slug}`);
        localStorage.removeItem(`blog-comments-${slug}`);
        // Note: Can't actually delete from static blogs data, just remove stats
        alert("Blog data cleared. To fully delete, remove from data/blogs.ts");
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

        const headers = Object.keys(data[0] || {});
        const csv = [
            headers.join(","),
            ...data.map((row) =>
                headers.map((h) => `"${String((row as Record<string, unknown>)[h] || "")}"`).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "blogs.csv";
        a.click();
    };

    return (
        <AuthGuard requiredPermission="blogs">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Blogs</h1>
                        <p className="mt-1 text-neutral-400">Manage blog posts and comments</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            className="rounded-full border border-lime-400/30 bg-lime-400/10 px-5 py-2.5 text-sm font-medium text-lime-400 hover:bg-lime-400 hover:text-black transition-all"
                        >
                            Export
                        </button>
                        <Link
                            href="/admin/blogs/editor"
                            className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-300 transition-all"
                        >
                            + New Post
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-neutral-400">Total Posts</p>
                        <p className="mt-1 text-2xl font-bold text-white">{blogsWithStats.length}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-neutral-400">Total Likes</p>
                        <p className="mt-1 text-2xl font-bold text-red-400">❤️ {totalLikes}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-neutral-400">Total Comments</p>
                        <p className="mt-1 text-2xl font-bold text-blue-400">💬 {totalComments}</p>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-lime-400/50"
                    />
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    {filtered.length === 0 ? (
                        <p className="p-8 text-center text-neutral-500">No blogs found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Post</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Author</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-neutral-400">Likes</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-neutral-400">Comments</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((blog) => (
                                        <tr key={blog.slug} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-16 rounded-lg overflow-hidden bg-neutral-800">
                                                        <img src={blog.image} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-white truncate max-w-[200px]">{blog.title}</p>
                                                        <p className="text-xs text-neutral-500">{blog.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-neutral-300">{blog.author}</td>
                                            <td className="px-4 py-4 text-center text-red-400">❤️ {blog.likes}</td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => setCommentsModal(blog)}
                                                    className="text-blue-400 hover:underline"
                                                >
                                                    💬 {blog.comments.length}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 text-neutral-400">{blog.date}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/blogs/editor?slug=${blog.slug}`}
                                                        className="text-lime-400 hover:underline text-sm"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteBlog(blog.slug)}
                                                        className="text-red-400 hover:underline text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-neutral-400">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Comments Modal */}
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
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="mb-2 text-xl font-bold text-white">Comments</h2>
                <p className="mb-6 text-sm text-neutral-400 truncate">{blog.title}</p>

                {blog.comments.length === 0 ? (
                    <p className="py-8 text-center text-neutral-500">No comments yet</p>
                ) : (
                    <div className="space-y-4">
                        {blog.comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-xl border border-white/10 bg-white/5 p-4"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400/20 text-lime-400 text-sm font-bold">
                                            {comment.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{comment.name}</p>
                                            <p className="text-xs text-neutral-500">{comment.date}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDeleteComment(comment.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-sm text-neutral-300">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
