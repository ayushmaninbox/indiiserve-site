"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/data/blogs";

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <article className="flex flex-col h-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all duration-700 hover:border-violet-500/20 hover:bg-white/[0.04] hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                    
                    {/* Category */}
                    <div className="absolute top-8 left-8">
                        <span className="backdrop-blur-md bg-violet-500/10 border border-violet-500/20 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-10 lg:p-12">
                    <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-8">
                        <time dateTime={post.date}>{post.date}</time>
                        <span className="w-1 h-1 rounded-full bg-violet-500/30" />
                        <span>{post.readTime}</span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 leading-[1.1] group-hover:text-violet-400 transition-colors duration-300">
                        {post.title}
                    </h2>

                    <p className="text-neutral-400 text-lg leading-relaxed mb-10 line-clamp-3 font-sans">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">
                                {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                                {post.author}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                Read More
                            </span>
                            <div className="w-12 h-12 rounded-full border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500 group-hover:border-violet-500 group-hover:text-white transition-all duration-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
