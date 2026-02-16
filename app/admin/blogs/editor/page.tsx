"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import AuthGuard from "@/components/admin/AuthGuard";
import { 
  ArrowLeft, Save, Loader2, LayoutPanelLeft, 
  Image as ImageIcon, Globe, User, BookOpen, Layers,
  X, Upload
} from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-white/[0.01] animate-pulse rounded-[2rem] border border-white/5" />
});

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editSlug = searchParams.get("slug");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        author: "IndiiServe Team",
        excerpt: "",
        content: "",
        category: "Technology",
        coverImage: "",
    });

    useEffect(() => {
        if (editSlug) {
            const fetchBlog = async () => {
                try {
                    const res = await fetch(`/api/blogs/${editSlug}`);
                    if (res.ok) {
                        const blog = await res.json();
                        setFormData({
                            title: blog.title || "",
                            author: blog.author || "IndiiServe Team",
                            excerpt: blog.excerpt || "",
                            content: blog.content || "",
                            category: blog.category || "Technology",
                            coverImage: blog.image || blog.coverImage || "",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch blog:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBlog();
        } else {
            setIsLoading(false);
        }
    }, [editSlug]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });
            const result = await res.json();
            if (result.success) {
                setFormData(prev => ({ ...prev, coverImage: result.path }));
                (window as any).showToast?.("Cover image updated", "success");
            } else {
                (window as any).showToast?.(result.error || "Upload failed", "error");
            }
        } catch (error) {
            console.error("Upload error:", error);
            (window as any).showToast?.("Failed to upload image", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.author || !formData.content) {
            (window as any).showToast?.("All required fields must be filled", "error");
            return;
        }

        setIsSaving(true);
        const slug = editSlug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const blogData = {
            ...formData,
            slug,
            image: formData.coverImage || "/images/blog-placeholder.jpg",
            coverImage: formData.coverImage || "/images/blog-placeholder.jpg",
            date: new Date().toISOString().split("T")[0],
            readTime: `${Math.max(1, Math.ceil(formData.content.replace(/<[^>]*>/g, '').length / 1000))} min read`,
        };

        try {
            const method = editSlug ? "PUT" : "POST";
            const url = editSlug ? `/api/blogs/${editSlug}` : "/api/blogs";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(blogData),
            });

            if (res.ok) {
                (window as any).showToast?.(`Blog post ${editSlug ? "updated" : "published"} successfully`, "success");
                router.push("/admin/blogs");
                router.refresh();
            } else {
                const error = await res.json();
                (window as any).showToast?.(error.error || "Save failed", "error");
            }
        } catch (error) {
            console.error("Save error:", error);
            (window as any).showToast?.("Failed to save blog post", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col pt-4 font-poppins text-white">
            {/* Header Area */}
            <header className="fixed top-0 left-0 right-0 z-40 lg:left-64 px-8 py-5 flex items-center justify-between bg-[#030014]/90 backdrop-blur-3xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs" className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{editSlug ? "Edit Post" : "Compose Post"}</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{editSlug ? "Modifying live entry" : "Creating new content"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-white shadow-xl shadow-violet-600/20 transition-all active:scale-95"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {editSlug ? "Update Post" : "Publish Post"}
                    </button>
                </div>
            </header>

            <div className="flex-1 mt-10 px-8 pb-10">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Title input */}
                        <div className="relative group">
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                placeholder="Post Title"
                                className="w-full bg-transparent text-4xl lg:text-6xl font-bold placeholder:text-white/10 outline-none focus:placeholder:text-white/5 transition-all py-4"
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) => setFormData(p => ({ ...p, content }))}
                            />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                        {/* Cover Image */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <ImageIcon className="w-4 h-4 text-violet-400" />
                                <span>Cover Image</span>
                            </div>
                            
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                                {formData.coverImage ? (
                                    <>
                                        <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <label className="p-3 bg-white text-black rounded-full cursor-pointer hover:scale-110 transition-transform">
                                                <Upload className="w-5 h-5" />
                                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            </label>
                                            <button onClick={() => setFormData(p => ({ ...p, coverImage: "" }))} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] transition-colors gap-3">
                                        <div className="p-4 rounded-full bg-white/[0.05] border border-white/10 text-slate-500">
                                            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload Image</span>
                                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Metadata Box */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-8 shadow-2xl">
                            {/* Author */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <User className="w-4 h-4 text-emerald-400" />
                                    <span>Author</span>
                                </div>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                                    placeholder="Writer's name"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all font-sans"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Layers className="w-4 h-4 text-amber-400" />
                                    <span>Category</span>
                                </div>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer font-sans"
                                >
                                    <option className="bg-[#0c0c0c]" value="Technology">Technology</option>
                                    <option className="bg-[#0c0c0c]" value="Logistics">Logistics</option>
                                    <option className="bg-[#0c0c0c]" value="Design">Design</option>
                                    <option className="bg-[#0c0c0c]" value="Business">Business</option>
                                    <option className="bg-[#0c0c0c]" value="Development">Development</option>
                                </select>
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <BookOpen className="w-4 h-4 text-blue-400" />
                                    <span>Summary</span>
                                </div>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                                    placeholder="Brief narrative overview..."
                                    rows={4}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 transition-all resize-none font-sans"
                                />
                            </div>
                        </div>

                        {/* Visibility Status */}
                        <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <Globe className="w-5 h-5 text-emerald-500" />
                                Public Access
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default function BlogEditorPage() {
    return (
        <AuthGuard requiredPermission="blogs">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="h-12 w-12 animate-spin rounded-2xl border-2 border-violet-500 border-t-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
                </div>
            }>
                <EditorContent />
            </Suspense>
        </AuthGuard>
    );
}
