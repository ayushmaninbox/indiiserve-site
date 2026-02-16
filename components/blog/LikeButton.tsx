"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
    slug: string;
}

export default function LikeButton({ slug }: LikeButtonProps) {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch current likes and check if user liked this session
        const fetchLikes = async () => {
            try {
                const res = await fetch(`/api/blogs/${slug}`);
                const data = await res.json();
                setLikes(data.likes || 0);

                // Check session indicator for like (not perfect, but better than localOnly)
                const storedIsLiked = localStorage.getItem(`blog-liked-${slug}`);
                setIsLiked(storedIsLiked === "true");
            } catch (error) {
                console.error("Failed to fetch likes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLikes();
    }, [slug]);

    const handleLike = async () => {
        const action = isLiked ? "unlike" : "like";
        const previousLikes = likes;
        const previousIsLiked = isLiked;

        // Optimistic update
        const newIsLiked = !isLiked;
        const newLikes = newIsLiked ? likes + 1 : Math.max(0, likes - 1);
        setIsLiked(newIsLiked);
        setLikes(newLikes);

        try {
            const res = await fetch(`/api/blogs/${slug}/likes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });

            if (!res.ok) throw new Error("Failed to sync like");
            
            const data = await res.json();
            setLikes(data.likes);
            localStorage.setItem(`blog-liked-${slug}`, newIsLiked.toString());
        } catch (error) {
            // Revert on error
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
            console.error(error);
        }
    };

    if (isLoading) return <div className="h-10 w-24 animate-pulse rounded-full bg-white/5 border border-white/10" />;

    return (
        <button
            onClick={handleLike}
            className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 transition-all duration-500 transform active:scale-95 ${isLiked
                    ? "border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5"
                }`}
        >
            <svg
                className={`h-5 w-5 transition-all duration-300 ${isLiked ? "scale-110 fill-red-400" : "group-hover:scale-110"}`}
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="text-sm font-bold tracking-tight">{likes} {likes === 1 ? "Like" : "Likes"}</span>
        </button>
    );
}
