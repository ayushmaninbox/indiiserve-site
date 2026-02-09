"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Project, defaultProjects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const horizontalWrapperRef = useRef<HTMLDivElement>(null);
    const [projects, setProjects] = useState<Project[]>(defaultProjects);

    useEffect(() => {
        // Load projects from API
        const loadProjects = async () => {
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to load projects:", error);
            }
        };
        loadProjects();
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        const container = horizontalWrapperRef.current;

        if (!section || !container) return;

        // Background stays dark
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => {
                gsap.to("body", {
                    backgroundColor: "#020202",
                    duration: 0.5,
                    ease: "power2.out",
                });
            },
            onLeaveBack: () => {
                gsap.to("body", {
                    backgroundColor: "#020202",
                    duration: 0.5,
                    ease: "power2.out",
                });
            },
        });

        // Header animation
        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 85%",
                    },
                }
            );
        }

        // Horizontal Scroll Animation
        const getScrollAmount = () => {
            return -(container.scrollWidth - window.innerWidth + 100);
        };

        const tween = gsap.to(container, {
            x: getScrollAmount,
            ease: "none",
        });

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1 + 200}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
        });

        // Loop through cards for internal parallax/animations
        const cards = gsap.utils.toArray(".work-card");
        cards.forEach((card: any) => {
            gsap.to(card.querySelector(".card-inner"), {
                scale: 0.95,
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: tween,
                    start: "center center",
                    end: "right center",
                    scrub: true,
                }
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            tween.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} id="work" className="bg-[#020202] text-white overflow-hidden">
            <div className="h-screen flex flex-col justify-center relative">
                <div ref={headerRef} className="container mx-auto px-5 md:px-20 mb-12 flex-shrink-0">
                    <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-violet-400 mb-6">
                        Featured Work
                    </span>
                    <h2 className="text-[clamp(2.5rem,6vw,4rem)] font-semibold font-migra leading-[1.1]">
                        Results that speak{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                            for themselves
                        </span>
                    </h2>
                </div>

                <div
                    ref={horizontalWrapperRef}
                    className="flex gap-10 px-5 md:px-20 w-fit items-center"
                >
                    {projects.map((project, index) => (
                        <div
                            key={project.title}
                            className="work-card group relative w-[80vw] md:w-[600px] h-[60vh] md:h-[500px] flex-shrink-0 rounded-3xl overflow-hidden shadow-xl transition-all duration-500"
                            data-cursor="view"
                        >
                            <div className="card-inner w-full h-full relative">
                                {/* Image Background */}
                                <div className="absolute inset-0">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${project.imageScale || ''}`}
                                    />
                                    {/* Gradient overlay for text readability */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-white/90 backdrop-blur px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
                                            {project.category}
                                        </span>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-xl">↗</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-bold mb-4 font-migra text-white">
                                            {project.title}
                                        </h3>
                                        <p className="text-white/90 text-lg font-light mb-6">
                                            {project.description}
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-violet-500/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-white font-medium border border-violet-500/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Call to action card at the end */}
                    <div className="w-[80vw] md:w-[400px] h-[60vh] md:h-[500px] flex-shrink-0 flex items-center justify-center">
                        <Link
                            href="#"
                            className="group flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-[#020202]/20 rounded-3xl hover:border-[#020202] hover:bg-white transition-all duration-500"
                            data-cursor="View All"
                        >
                            <span className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">→</span>
                            <span className="text-xl font-bold font-migra">View All Projects</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
