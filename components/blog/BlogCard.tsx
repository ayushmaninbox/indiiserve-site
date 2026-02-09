"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/data/blogs";

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm transition-all duration-500 hover:border-violet-500/30 hover:bg-neutral-900/80">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 rounded-full bg-violet-500/90 px-3 py-1 text-xs font-bold text-white">
                        {post.category}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-3 flex items-center gap-3 text-sm text-neutral-400">
                        <span>{post.date}</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-500" />
                        <span>{post.readTime}</span>
                    </div>

                    <h2 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-violet-400 lg:text-2xl">
                        {post.title}
                    </h2>

                    <p className="mb-4 text-sm text-neutral-400 line-clamp-2">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">By {post.author}</span>
                        <span className="text-sm font-medium text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                            Read More →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
