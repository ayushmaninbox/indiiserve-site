import { readBlogs } from "@/lib/blogUtils";
import BlogCard from "@/components/blog/BlogCard";

export const metadata = {
    title: "Blog | InDiiServe.ai",
    description: "Insights, tutorials, and updates from the InDiiServe.ai team.",
};

export const dynamic = 'force-dynamic';

export default function BlogPage() {
    const blogs = readBlogs();
    return (
        <main className="min-h-screen bg-[#030014] text-white pt-32 pb-24">
            {/* Hero Section */}
            <div className="text-center py-16 px-4 relative z-10">
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-violet-400 mb-6 animate-fade-in">
                    <span className="w-8 h-[1px] bg-violet-500/50" />
                    Editorial
                    <span className="w-8 h-[1px] bg-violet-500/50" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-none relative z-10">
                    Insights & <span className="text-violet-500">Innovation</span>
                </h1>
                <div className="h-1 w-20 bg-violet-600 mx-auto mb-8" />
                <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-sans tracking-wide">
                    Exploring the intersection of branding, technology, and business strategy to help your business navigate the future.
                </p>
            </div>

            {/* Search Bar - Aesthetic Only for now */}
            <div className="max-w-md mx-auto mb-16 px-4 relative z-10">
               <div className="relative shadow-2xl rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="relative w-full h-12 pl-12 pr-4 bg-transparent border border-white/10 rounded-full text-sm outline-none focus:border-violet-500 transition-all placeholder:text-neutral-500"
                  />
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="mt-32 p-12 lg:p-20 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-white mb-6">
                        Stay in the Loop
                    </h2>
                    <p className="max-w-md mx-auto text-neutral-400 mb-10 text-sm">
                        Join our community of forward-thinking leaders and get the latest insights delivered straight to your inbox.
                    </p>
                    <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3.5 text-white text-sm outline-none focus:border-violet-500 transition-colors"
                        />
                        <button className="bg-white text-black font-bold uppercase text-[10px] tracking-widest px-8 py-3.5 rounded-full hover:bg-violet-500 hover:text-white transition-all">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
