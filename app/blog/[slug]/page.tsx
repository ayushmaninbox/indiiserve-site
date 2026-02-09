import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/data/blogs";
import LikeButton from "@/components/blog/LikeButton";
import CommentSection from "@/components/blog/CommentSection";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return blogs.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
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
    const post = blogs.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-transparent pt-32 pb-20">
            <article className="container mx-auto px-4 sm:px-6">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="mb-8 inline-flex items-center gap-2 text-neutral-400 transition-colors hover:text-violet-400"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blog
                </Link>

                {/* Hero Image */}
                <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-2xl">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute top-6 left-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1.5 text-sm font-bold text-white">
                        {post.category}
                    </span>
                </div>

                {/* Content Container */}
                <div className="mx-auto max-w-3xl">
                    {/* Meta */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                        <span>{post.date}</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-500" />
                        <span>{post.readTime}</span>
                        <span className="h-1 w-1 rounded-full bg-neutral-500" />
                        <span>By {post.author}</span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-8 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                        {post.title}
                    </h1>

                    {/* Like Button */}
                    <div className="mb-12">
                        <LikeButton slug={post.slug} />
                    </div>

                    {/* Article Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-white
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-neutral-300 prose-p:leading-relaxed
                            prose-strong:text-white
                            prose-ul:text-neutral-300 prose-li:marker:text-violet-400
                            prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                    />

                    {/* Comments Section */}
                    <CommentSection slug={post.slug} />
                </div>
            </article>
        </main>
    );
}

// Simple markdown-like formatting
function formatContent(content: string): string {
    return content
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul])(.+)$/gm, '<p>$1</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>\s*<\/p>/g, '');
}
