"use client";

import { useState, useEffect, FormEvent } from "react";

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

    useEffect(() => {
        // Load comments from localStorage
        const stored = localStorage.getItem(`blog-comments-${slug}`);
        if (stored) {
            setComments(JSON.parse(stored));
        }
    }, [slug]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;

        setIsSubmitting(true);

        const newComment: Comment = {
            id: Date.now().toString(),
            name: name.trim(),
            content: content.trim(),
            date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
        };

        const updatedComments = [newComment, ...comments];
        setComments(updatedComments);

        // Save to localStorage
        localStorage.setItem(`blog-comments-${slug}`, JSON.stringify(updatedComments));

        // Reset form
        setName("");
        setContent("");
        setIsSubmitting(false);
    };

    return (
        <div className="mt-16 border-t border-white/10 pt-12">
            <h3 className="mb-8 text-2xl font-bold text-white">
                Comments <span className="text-lime-400">({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 space-y-4">
                <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-300">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-lime-400/50 focus:bg-white/10"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="comment" className="mb-2 block text-sm font-medium text-neutral-300">
                        Comment
                    </label>
                    <textarea
                        id="comment"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your comment..."
                        rows={4}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-lime-400/50 focus:bg-white/10"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-lime-400 px-8 py-3 font-bold text-black transition-all hover:bg-lime-300 disabled:opacity-50"
                >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-center text-neutral-500">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="rounded-xl border border-white/10 bg-white/5 p-6"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-semibold text-white">{comment.name}</span>
                                <span className="text-sm text-neutral-500">{comment.date}</span>
                            </div>
                            <p className="text-neutral-300">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
