import { blogs } from "@/data/blogs";
import BlogCard from "@/components/blog/BlogCard";

export const metadata = {
    title: "Blog | InDiiServe",
    description: "Insights, tutorials, and updates from the InDiiServe team.",
};

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-transparent pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold uppercase tracking-tighter text-white sm:text-5xl lg:text-6xl">
                        Our <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Blog</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-neutral-400">
                        Insights, tutorials, and updates from our team. Stay ahead with the latest in design and development.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                    {blogs.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>
            </div>
        </main>
    );
}
