"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/admin/AuthGuard";
import { blogs } from "@/data/blogs";

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editSlug = searchParams.get("slug");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Technology");
    const [coverImage, setCoverImage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editSlug) {
            const blog = blogs.find((b) => b.slug === editSlug);
            if (blog) {
                setTitle(blog.title);
                setAuthor(blog.author);
                setExcerpt(blog.excerpt);
                setContent(blog.content);
                setCategory(blog.category);
                setCoverImage(blog.image);
            }
        }
    }, [editSlug]);

    const handleSave = () => {
        if (!title || !author || !content) {
            alert("Please fill in all required fields");
            return;
        }

        setIsSaving(true);

        // In a real app, this would save to a backend
        // For now, we'll save to localStorage as custom blogs
        const customBlogs = JSON.parse(localStorage.getItem("customBlogs") || "[]");

        const slug = editSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const blogData = {
            slug,
            title,
            author,
            excerpt,
            content,
            category,
            image: coverImage || "/images/medcare.jpg",
            date: new Date().toISOString().split("T")[0],
            readTime: `${Math.ceil(content.length / 1000)} min read`,
        };

        if (editSlug) {
            // Update existing
            const index = customBlogs.findIndex((b: { slug: string }) => b.slug === editSlug);
            if (index >= 0) {
                customBlogs[index] = blogData;
            } else {
                customBlogs.push(blogData);
            }
        } else {
            customBlogs.push(blogData);
        }

        localStorage.setItem("customBlogs", JSON.stringify(customBlogs));

        setTimeout(() => {
            setIsSaving(false);
            alert(`Blog ${editSlug ? "updated" : "created"} successfully!`);
            router.push("/admin/blogs");
        }, 500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blogs"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {editSlug ? "Edit Post" : "New Post"}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-full bg-violet-500 px-6 py-2.5 font-bold text-white hover:bg-violet-400 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Post"}
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title..."
                        className="w-full bg-transparent text-3xl font-bold text-white placeholder-neutral-600 outline-none"
                    />

                    {/* Content Editor */}
                    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
                        <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                            <button className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white">
                                <strong>B</strong>
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white italic">
                                I
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white">
                                H2
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white">
                                H3
                            </button>
                            <button className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white">
                                • List
                            </button>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your content here... (Supports markdown)"
                            rows={20}
                            className="w-full resize-none bg-transparent text-white placeholder-neutral-600 outline-none"
                        />
                        <div className="mt-4 border-t border-white/10 pt-4 text-right text-sm text-neutral-500">
                            {content.length} characters
                        </div>
                    </div>
                </div>

                {/* Settings Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-5">
                        <h3 className="font-semibold text-white">Post Settings</h3>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                Author *
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Author name"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-violet-500/50"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-white outline-none"
                            >
                                <option value="Technology" className="bg-black">Technology</option>
                                <option value="Design" className="bg-black">Design</option>
                                <option value="Development" className="bg-black">Development</option>
                                <option value="Business" className="bg-black">Business</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                Excerpt
                            </label>
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Short summary..."
                                rows={3}
                                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-violet-500/50"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                Cover Image URL
                            </label>
                            <input
                                type="text"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="/images/cover.jpg"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-violet-500/50"
                            />
                        </div>

                        {coverImage && (
                            <div className="rounded-xl overflow-hidden border border-white/10">
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
                                    className="w-full h-32 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BlogEditorPage() {
    return (
        <AuthGuard requiredPermission="blogs">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                </div>
            }>
                <EditorContent />
            </Suspense>
        </AuthGuard>
    );
}
