import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { readBlogs } from "@/lib/blogUtils";
import LikeButton from "@/components/blog/LikeButton";
import CommentSection from "@/components/blog/CommentSection";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const blogs = readBlogs();
    return blogs.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const blogs = readBlogs();
    const post = blogs.find((p) => p.slug === slug);

    if (!post) {
        return { title: "Post Not Found" };
    }

    return {
        title: `${post.title} | InDiiServe Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const blogs = readBlogs();
    const post = blogs.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#030014] pt-24 pb-20 relative z-10 text-white font-poppins">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-violet-400 transition-colors group">
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to all insights
                </Link>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {post.image && (
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8 relative border border-white/5 shadow-2xl">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-violet-400 mb-6 animate-fade-in">
                    <span className="backdrop-blur-md bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 rounded-full">
                        {post.category}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-500 tracking-widest">{post.date}</span>
                </div>

                <h1 className="text-3xl lg:text-5xl font-black text-white font-migra mb-8 leading-[1.1] tracking-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-3 mb-12 py-6 border-y border-white/5">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-xs font-bold uppercase">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white uppercase tracking-wider">{post.author}</div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest">{post.readTime} Read</div>
                    </div>
                    <div className="ml-auto">
                        <LikeButton slug={post.slug} />
                    </div>
                </div>

                <div
                    className="prose prose-invert prose-stone max-w-none prose-lg prose-p:text-slate-300 prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-white prose-li:text-slate-300 prose-img:rounded-3xl tiptap-editor font-sans
                        prose-strong:text-white prose-strong:font-bold
                        prose-blockquote:border-violet-500 prose-blockquote:bg-violet-500/5 prose-blockquote:text-violet-200 prose-blockquote:rounded-r-xl
                        prose-a:text-violet-400 hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:border prose-img:border-white/5"
                    dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />

                <div className="mt-20 pt-10 border-t border-white/5">
                    <CommentSection slug={post.slug} />
                </div>
            </article>
        </main>
    );
}

// Enhanced formatting to support both legacy Markdown-lite and modern HTML
function formatContent(content: string): string {
    if (!content) return "";

    // If it looks like HTML already (contains tags), just return it
    // Tiptap content starts with tags like <p>, <h2>, etc.
    if (content.trim().startsWith('<') && content.includes('>')) {
        return content;
    }

    // Otherwise, apply legacy Markdown support
    return content
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-violet-400 hover:underline">$1</a>')
        .replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-2xl border border-white/5 my-8 shadow-2xl" />')
        .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-violet-500 bg-violet-500/5 px-6 py-2 rounded-r-xl italic my-6">$1</blockquote>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hbulq])(.+)$/gm, '<p>$1</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>\s*<\/p>/g, '');
}
