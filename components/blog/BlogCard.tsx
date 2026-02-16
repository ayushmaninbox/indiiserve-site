"use client";

import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/lib/types";

interface BlogCardProps {
    post: Blog;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <article className="flex flex-col h-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.04] hover:-translate-y-1 shadow-[0_18px_45px_rgba(139,92,246,0.02)] hover:shadow-[0_28px_70px_rgba(139,92,246,0.05)]">
                {/* Image Section */}
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                        src={post.image || "/images/medcare.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">
                        <span>{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <time dateTime={post.date}>{post.date}</time>
                    </div>

                    <h2 className="text-lg font-bold text-white mb-3 group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                    </h2>

                    <p className="text-sm text-neutral-400 mb-6 flex-1 line-clamp-2 font-sans leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-[8px] font-bold text-violet-300">
                                {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium tracking-tight whitespace-nowrap">{post.author}</span>
                        </div>
                        <span className="flex items-center gap-1 opacity-60">
                            {post.readTime}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
