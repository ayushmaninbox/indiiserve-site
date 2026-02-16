"use client";

import { useState, useEffect, FormEvent } from "react";
import { User, Send, MessageSquare } from "lucide-react";

interface Comment {
    id: string;
    name: string;
    content: string;
    date: string;
}

interface CommentSectionProps {
    slug: string;
}

export default function CommentSection({ slug }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/blogs/${slug}/comments`);
                const data = await res.json();
                setComments(data || []);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [slug]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/blogs/${slug}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), content: content.trim() }),
            });

            if (!res.ok) throw new Error("Failed to post comment");

            const newComment = await res.json();
            setComments([newComment, ...comments]);
            setName("");
            setContent("");
        } catch (error) {
            console.error(error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-20 border-t border-white/5 pt-16">
            <div className="flex items-center gap-4 mb-12">
                <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                    <MessageSquare className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tight">
                        Discussion
                    </h3>
                    <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">
                        {comments.length} {comments.length === 1 ? "Thought" : "Thoughts"} shared
                    </p>
                </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-16 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-widest text-neutral-400">
                                Your Identity
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full rounded-xl border border-white/10 bg-[#030014]/50 pl-11 pr-4 py-3.5 text-white placeholder-neutral-600 outline-none transition-all focus:border-violet-500/50 focus:bg-[#030014]/80 text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comment" className="mb-2 block text-xs font-bold uppercase tracking-widest text-neutral-400">
                            Your Message
                        </label>
                        <textarea
                            id="comment"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your insightful thought..."
                            rows={4}
                            className="w-full resize-none rounded-xl border border-white/10 bg-[#030014]/50 px-4 py-4 text-white placeholder-neutral-600 outline-none transition-all focus:border-violet-500/50 focus:bg-[#030014]/80 text-sm leading-relaxed"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-3.5 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-violet-400 hover:text-white disabled:opacity-50 active:scale-95"
                        >
                            <span className="relative z-10">{isSubmitting ? "Transmitting..." : "Post Thought"}</span>
                            <Send className="relative z-10 w-3.5 h-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12 rounded-3xl border border-dashed border-white/10">
                        <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold">The void awaits your signal.</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-violet-500/30 hover:bg-white/[0.07]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter text-violet-400">
                                        {comment.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-white italic tracking-tight">{comment.name}</div>
                                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                                            {new Date(comment.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed pl-[52px]">
                                {comment.content}
                            </p>
                        </div>
                    ))
                 )}
            </div>
        </div>
    );
}
