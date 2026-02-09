"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
    {
        id: 1,
        title: "MedCare",
        category: "Healthcare",
        image: "/images/medcare.jpg",
        direction: "left",
    },
    {
        id: 2,
        title: "PaySwift",
        category: "Fintech",
        image: "/images/payswift.jpg",
        direction: "down",
    },
    {
        id: 3,
        title: "TechFlow",
        category: "E-commerce",
        image: "/images/techflowcommerce.jpg",
        direction: "right",
    },
    {
        id: 4,
        title: "UrbanArch",
        category: "Architecture",
        image: "/images/urbanarch.jpg",
        direction: "up",
    },
    {
        id: 5,
        title: "NeonSpace",
        category: "Design",
        image: "/images/medcare.jpg",
        direction: "left",
    },
    {
        id: 6,
        title: "SoftScale",
        category: "SaaS",
        image: "/images/payswift.jpg",
        direction: "down",
    },
    {
        id: 7,
        title: "GreenLeaf",
        category: "Eco",
        image: "/images/techflowcommerce.jpg",
        direction: "right",
    },
    {
        id: 8,
        title: "SkyHigh",
        category: "Travel",
        image: "/images/urbanarch.jpg",
        direction: "up",
    },
];

export default function ScrollPortfolio() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);

            const container = containerRef.current;
            const grid = gridRef.current;
            if (!container || !grid) return;

            // Title Animation
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                    },
                }
            );

            // Cards Animation - triggered by grid entering viewport
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                const direction = projects[index].direction;
                let xFrom = 0;
                let yFrom = 0;

                // Set starting offset based on direction
                switch (direction) {
                    case "left":
                        xFrom = -80;
                        break;
                    case "right":
                        xFrom = 80;
                        break;
                    case "up":
                        yFrom = 80;
                        break;
                    case "down":
                        yFrom = -80;
                        break;
                }

                // Animate from offset to final position
                gsap.fromTo(
                    card,
                    {
                        x: xFrom,
                        y: yFrom,
                        opacity: 0,
                        scale: 0.9
                    },
                    {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: grid, // Use the grid as trigger
                            start: "top 85%",
                            end: "top 40%",
                            scrub: true,
                        },
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
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

                {/* Portfolio Grid - Equal size tiles */}
                <div
                    ref={gridRef}
                    className="grid gap-6 grid-cols-2 lg:grid-cols-4 lg:gap-8"
                >
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            ref={(el) => { cardsRef.current[index] = el }}
                            className="group relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900"
                        >
                            <div className="absolute inset-0 z-10 bg-black/20 transition-colors duration-500 group-hover:bg-black/0" />

                            {/* Image */}
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />

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
