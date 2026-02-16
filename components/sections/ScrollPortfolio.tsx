"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/lib/types";

export default function ScrollPortfolio() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const [isMobile, setIsMobile] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/projects");
                const data: Project[] = await res.json();
                // Take only the first 8 items for homepage as requested
                setProjects(data.slice(0, 8));
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        };
        fetchProjects();

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Smart Video Playback with Intersection Observer
    useEffect(() => {
        if (!isMobile || projects.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target as HTMLVideoElement;
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => observer.disconnect();
    }, [projects, isMobile]);

    useEffect(() => {
        if (projects.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);

            const container = containerRef.current;
            const grid = gridRef.current;
            if (!container || !grid) return;

            // Title Animation
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 85%",
                    },
                }
            );

            // Cards Animation
            if (isMobile) {
                // Simpler animation for mobile - no scrub, just fade in up
                cardsRef.current.forEach((card, index) => {
                    if (!card) return;
                    gsap.fromTo(
                        card,
                        { y: 30, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 90%",
                            },
                        }
                    );
                });
            } else {
                const directions = ["left", "down", "right", "up"];
                cardsRef.current.forEach((card, index) => {
                    if (!card) return;

                    const direction = directions[index % 4];
                    let xFrom = 0;
                    let yFrom = 0;

                    switch (direction) {
                        case "left": xFrom = -80; break;
                        case "right": xFrom = 80; break;
                        case "up": yFrom = 80; break;
                        case "down": yFrom = -80; break;
                    }

                    gsap.fromTo(
                        card,
                        { x: xFrom, y: yFrom, opacity: 0, scale: 0.9 },
                        {
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger: grid,
                                start: "top 85%",
                                end: "top 40%",
                                scrub: true,
                            },
                        }
                    );
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [projects, isMobile]);

    return (
        <section
            ref={containerRef}
            id="work"
            className="relative z-10 w-full bg-transparent py-20 lg:py-24"
        >
            <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="mb-12 text-center lg:mb-16">
                    <h2
                        ref={titleRef}
                        className="text-3xl font-bold uppercase tracking-tighter text-white sm:text-4xl lg:text-5xl"
                    >
                        Selected <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Works</span>
                    </h2>
                    <div className="mt-4 flex justify-center">
                        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    </div>
                </div>

                {/* Portfolio Grid */}
                <div
                    ref={gridRef}
                    className="grid gap-6 grid-cols-2 lg:grid-cols-4 lg:gap-8"
                >
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            ref={(el) => { cardsRef.current[index] = el }}
                            className="group relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black"
                        >
                            <div className="absolute inset-0 z-10 bg-black/20 transition-colors duration-500 group-hover:bg-black/0" />

                            {/* Video or Image */}
                            {project.type === "video" ? (
                                <video
                                    ref={(el) => { videoRefs.current[index] = el }}
                                    src={project.preview || project.media}
                                    autoPlay={!isMobile}
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={project.media}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                            )}

                            {/* Overlay Content */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
                                    <span className="inline-block rounded-full bg-violet-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                                        {project.category}
                                    </span>
                                    <h3 className="mt-1 text-lg font-bold text-white lg:text-xl">
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
