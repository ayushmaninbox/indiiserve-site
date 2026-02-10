import { blogs } from "@/data/blogs";
import BlogCard from "@/components/blog/BlogCard";

export const metadata = {
    title: "Blog | InDiiServe",
    description: "Insights, tutorials, and updates from the InDiiServe team.",
};

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[#030014] pt-40 pb-32 relative z-10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-violet-400 mb-8 animate-fade-in">
                        <span className="w-12 h-[1px] bg-violet-500/50" />
                        Our Perspective
                    </div>
                    <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-10 leading-[0.9]">
                        Insights & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                            Innovation
                        </span>
                    </h1>
                    <p className="max-w-xl text-lg lg:text-xl text-neutral-400 leading-relaxed font-sans">
                        Exploring the intersection of design, technology, and business to help your brand stay ahead of the curve.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
                    {blogs.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="mt-32 p-12 lg:p-20 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold uppercase tracking-tighter text-white mb-6">
                        Stay in the Loop
                    </h2>
                    <p className="max-w-md mx-auto text-neutral-400 mb-10">
                        Join our community of innovators and get the latest insights delivered straight to your inbox.
                    </p>
                    <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white outline-none focus:border-violet-500 transition-colors"
                        />
                        <button className="bg-white text-black font-bold uppercase text-xs tracking-widest px-8 py-4 rounded-full hover:bg-violet-400 hover:text-white transition-all">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
