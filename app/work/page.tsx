"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type MediaType = "video" | "image";

interface WorkItem {
    id: number;
    title: string;
    category: string;
    description: string;
    credits: string;
    media: string;
    type: MediaType;
}

const works: WorkItem[] = [
    {
        id: 1,
        title: "Honeywell",
        category: "Ad Film",
        description: "A high-impact ad film showcasing Honeywell's innovative smart home solutions with cinematic visuals and compelling storytelling.",
        credits: "Direction & Post-production — InDiiServe Creative Studio",
        media: "/Works/honeywell_1.mp4",
        type: "video",
    },
    {
        id: 2,
        title: "Rapidbox",
        category: "Branding",
        description: "Complete brand identity and promotional video for Rapidbox — a next-gen logistics solution built for speed and reliability.",
        credits: "Brand Strategy, Motion Design — InDiiServe",
        media: "/Works/Rapidbox Work_1.mp4",
        type: "video",
    },
    {
        id: 3,
        title: "Fevicol Pod",
        category: "Creative Campaign",
        description: "A playful and engaging ad concept for Fevicol, blending humor with product storytelling in a snackable format.",
        credits: "Concept & Editing — InDiiServe Creative",
        media: "/Works/fevicol pod_1.mp4",
        type: "video",
    },
    {
        id: 4,
        title: "Fashion Film I",
        category: "Fashion",
        description: "A cinematic fashion film capturing movement, texture, and styling with editorial-grade visuals.",
        credits: "Direction, Cinematography & Color Grade — InDiiServe",
        media: "/Works/femalemodel.mp4",
        type: "video",
    },
    {
        id: 5,
        title: "Fashion Film II",
        category: "Fashion",
        description: "A continuation of the fashion series with bold transitions and contemporary styling that elevates the brand narrative.",
        credits: "Creative Direction & Edit — InDiiServe",
        media: "/Works/femalemodel2.mp4",
        type: "video",
    },
    {
        id: 6,
        title: "Fashion Film III",
        category: "Fashion",
        description: "The final piece in the trilogy — a fluid blend of movement and attitude captured through a modern lens.",
        credits: "Full Production — InDiiServe",
        media: "/Works/femalemodel3.mp4",
        type: "video",
    },
    {
        id: 7,
        title: "Treadfi",
        category: "FinTech",
        description: "Brand video for Treadfi, a fintech platform, featuring sleek UI animations and data-driven storytelling.",
        credits: "Motion Graphics & Brand Film — InDiiServe",
        media: "/Works/treadfi.mp4",
        type: "video",
    },
    {
        id: 8,
        title: "SaaS Platform",
        category: "SaaS",
        description: "A polished product demo video for a SaaS platform, highlighting key features through elegant screen recordings and motion design.",
        credits: "UI Animation & Edit — InDiiServe",
        media: "/Works/saas2_1.mp4",
        type: "video",
    },
    {
        id: 9,
        title: "Saree Collection",
        category: "Product",
        description: "A visually rich product showcase for a premium saree collection, blending traditional elegance with modern edit styles.",
        credits: "Videography & Post-production — InDiiServe",
        media: "/Works/saree.mp4",
        type: "video",
    },
    {
        id: 10,
        title: "Ad Creative",
        category: "Advertising",
        description: "A quick-paced, attention-grabbing ad edit designed for social media engagement and conversion.",
        credits: "Concept & Edit — InDiiServe",
        media: "/Works/Ad edit_1.mp4",
        type: "video",
    },
    {
        id: 11,
        title: "Illustration Motion",
        category: "Design",
        description: "An animated illustration bringing characters and concepts to life with playful motion and vibrant color palettes.",
        credits: "Illustration & Animation — InDiiServe Design",
        media: "/Works/illustrationgif.gif",
        type: "image",
    },
    {
        id: 12,
        title: "Kicho Branding",
        category: "Product Design",
        description: "Clean and minimal product photography and branding for Kicho — a premium lifestyle brand.",
        credits: "Photography & Brand Design — InDiiServe",
        media: "/Works/kicho.jpeg",
        type: "image",
    },
    {
        id: 13,
        title: "Kicho Collection",
        category: "Product Design",
        description: "Extended product line photography with consistent branding language and visual identity.",
        credits: "Art Direction & Photography — InDiiServe",
        media: "/Works/kicho2.jpeg",
        type: "image",
    },
    {
        id: 14,
        title: "Fishy Business",
        category: "Branding",
        description: "A bold and quirky brand identity for a seafood startup, featuring playful graphics and strong typography.",
        credits: "Brand Identity & Packaging — InDiiServe",
        media: "/Works/fishy business1.png",
        type: "image",
    },
    {
        id: 15,
        title: "App Interface",
        category: "UI/UX",
        description: "Sleek mobile app interface designs showcased through realistic iPhone mockups, highlighting clean navigation and modern aesthetics.",
        credits: "UI/UX Design — InDiiServe Digital",
        media: "/Works/iphones.jpeg",
        type: "image",
    },
    {
        id: 16,
        title: "Card Design",
        category: "Print",
        description: "Premium business card designs featuring modern layouts, foil finishes, and brand-consistent color palettes.",
        credits: "Print Design — InDiiServe",
        media: "/Works/card.jpeg",
        type: "image",
    },
    {
        id: 17,
        title: "Card Design II",
        category: "Print",
        description: "A second iteration of the card series exploring different materials and vertical layouts.",
        credits: "Print Design — InDiiServe",
        media: "/Works/card2.jpeg",
        type: "image",
    },
    {
        id: 18,
        title: "Rifle Gear",
        category: "Product",
        description: "High-end product photography for a tactical gear brand with dramatic lighting and precision composition.",
        credits: "Product Photography — InDiiServe",
        media: "/Works/rifle.jpeg",
        type: "image",
    },
    {
        id: 19,
        title: "TV Remote Concept",
        category: "Product Design",
        description: "A concept rendering of a next-gen TV remote with minimalist industrial design and ergonomic form.",
        credits: "3D Rendering & Concept — InDiiServe",
        media: "/Works/tvremote.jpeg",
        type: "image",
    },
];

const categories = ["All", ...Array.from(new Set(works.map((w) => w.category)))];

export default function WorkPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const filtered = activeFilter === "All" ? works : works.filter((w) => w.category === activeFilter);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".work-hero > *",
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll(".work-card");
        gsap.fromTo(
            cards,
            { y: 60, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }
        );
    }, [activeFilter]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedWork) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [selectedWork]);

    return (
        <main ref={containerRef} className="min-h-screen bg-[#030014] relative z-10">
            {/* Hero — extra top padding to clear fixed navbar */}
            <section className="relative pt-44 pb-12">
                <div className="work-hero container mx-auto px-4 text-center max-w-3xl">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        Portfolio
                    </span>
                    <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                        Our <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Work</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-neutral-400 leading-relaxed">
                        A curated collection of our finest projects — from ad films and brand identities to product design and UI/UX.
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="sticky top-20 z-30 border-y border-white/5 bg-[#030014]/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${activeFilter === cat
                                        ? "bg-violet-500 text-white"
                                        : "text-neutral-500 hover:text-white border border-white/[0.06] hover:border-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Works Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((work) => (
                            <div
                                key={work.id}
                                onClick={() => setSelectedWork(work)}
                                className="work-card group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-violet-500/20 cursor-pointer"
                            >
                                {/* Media Preview */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                                    {work.type === "video" ? (
                                        <video
                                            src={work.media}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={work.media}
                                            alt={work.title}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Category pill */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="rounded-full bg-violet-500/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                                            {work.category}
                                        </span>
                                    </div>

                                    {/* Play/View indicator */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                            {work.type === "video" ? (
                                                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Title Bar */}
                                <div className="p-4">
                                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                                        {work.title}
                                    </h3>
                                    <p className="text-xs text-neutral-600 mt-1 line-clamp-1">
                                        {work.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-neutral-600">
                            No works found in this category.
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/5 py-20">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                        Have a Project in Mind?
                    </h2>
                    <p className="mx-auto mb-8 text-neutral-400">
                        Let&apos;s bring your vision to life with strategy, design, and cutting-edge execution.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-400 active:scale-95"
                    >
                        Start a Conversation
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* ── Detail Modal ── */}
            {selectedWork && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={() => setSelectedWork(null)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                    {/* Modal Card */}
                    <div
                        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a1a] shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedWork(null)}
                            className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Media - Large */}
                        <div className="relative w-full aspect-video bg-black rounded-t-2xl overflow-hidden">
                            {selectedWork.type === "video" ? (
                                <video
                                    src={selectedWork.media}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls
                                    className="absolute inset-0 w-full h-full object-contain bg-black"
                                />
                            ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={selectedWork.media}
                                    alt={selectedWork.title}
                                    className="absolute inset-0 w-full h-full object-contain bg-black"
                                />
                            )}
                        </div>

                        {/* Details */}
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-3 py-1 text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                                    {selectedWork.category}
                                </span>
                                <span className="text-xs text-neutral-600">
                                    {selectedWork.type === "video" ? "Video" : "Image"}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                {selectedWork.title}
                            </h2>

                            <p className="text-neutral-400 leading-relaxed mb-6 text-base">
                                {selectedWork.description}
                            </p>

                            <div className="flex items-start gap-3 pt-5 border-t border-white/5">
                                <svg className="w-4 h-4 text-violet-500/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-neutral-600 block mb-1">Credits</span>
                                    <span className="text-sm text-neutral-300">{selectedWork.credits}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
