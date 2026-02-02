"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
    slug: string;
}

export default function LikeButton({ slug }: LikeButtonProps) {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Load from localStorage
        const storedLikes = localStorage.getItem(`blog-likes-${slug}`);
        const storedIsLiked = localStorage.getItem(`blog-liked-${slug}`);

        if (storedLikes) setLikes(parseInt(storedLikes, 10));
        if (storedIsLiked) setIsLiked(storedIsLiked === "true");
    }, [slug]);

    const handleLike = () => {
        const newIsLiked = !isLiked;
        const newLikes = newIsLiked ? likes + 1 : likes - 1;

        setIsLiked(newIsLiked);
        setLikes(newLikes);

        // Save to localStorage
        localStorage.setItem(`blog-likes-${slug}`, newLikes.toString());
        localStorage.setItem(`blog-liked-${slug}`, newIsLiked.toString());
    };

    return (
        <button
            onClick={handleLike}
            className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 transition-all duration-300 ${isLiked
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:border-red-500/30 hover:text-red-400"
                }`}
        >
            <svg
                className={`h-5 w-5 transition-transform duration-300 ${isLiked ? "scale-110" : "group-hover:scale-110"}`}
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
            <span className="text-sm font-medium">{likes} {likes === 1 ? "Like" : "Likes"}</span>
        </button>
    );
}
