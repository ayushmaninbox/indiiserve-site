"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "TechFlow Commerce",
        category: "E-Commerce",
        description: "300% increase in online sales through integrated digital strategy",
        gradient: "from-[#667eea] to-[#764ba2]",
        tags: ["SEO", "PPC", "Social Media"],
    },
    {
        title: "MedCare Solutions",
        category: "Healthcare",
        description: "Patient acquisition increased by 250% with targeted campaigns",
        gradient: "from-[#f093fb] to-[#f5576c]",
        tags: ["Content Marketing", "Lead Gen"],
    },
    {
        title: "PaySwift Finance",
        category: "FinTech",
        description: "Brand awareness grew 400% in 6 months through strategic positioning",
        gradient: "from-[#4facfe] to-[#00f2fe]",
        tags: ["Branding", "PR", "Analytics"],
    },
];

export default function Work() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Background color transition
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => {
                gsap.to("body", {
                    backgroundColor: "#FBFBF4",
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

        // Staggered card animations
        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            gsap.fromTo(
                card,
                { opacity: 0, y: 100, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    delay: i * 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                    },
                }
            );

            // Parallax effect inside card
            const image = card.querySelector(".card-image");
            if (image) {
                gsap.to(image, {
                    yPercent: -15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} id="work" className="py-32 md:py-48 bg-[#FBFBF4] text-[#020202]">
            <div className="max-w-[1400px] mx-auto px-5 md:px-20">
                <div ref={headerRef} className="text-center max-w-[900px] mx-auto mb-20">
                    <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-[#4a7c10] mb-6">
                        Featured Work
                    </span>
                    <h2 className="text-[clamp(2.5rem,6vw,4rem)] font-semibold font-migra leading-[1.1]">
                        Results that speak{" "}
                        <span className="bg-gradient-to-r from-[#8BC34A] to-[#C0FF00] bg-clip-text text-transparent">
                            for themselves
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {projects.map((project, index) => (
                        <div
                            key={project.title}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className="work-card group rounded-3xl overflow-hidden bg-white shadow-[0_4px_40px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_80px_rgba(0,0,0,0.15)]"
                            data-cursor="View"
                        >
                            <div className="h-72 relative overflow-hidden">
                                <div
                                    className={`card-image absolute inset-0 bg-gradient-to-br ${project.gradient} scale-110`}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                <div className="absolute top-5 left-5">
                                    <span className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.05em] shadow-lg">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#4a7c10] transition-colors duration-300">
                                    {project.title}
                                </h3>
                                <p className="text-sm opacity-60 mb-5 leading-relaxed">
                                    {project.description}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-[#f0f0f0] px-4 py-1.5 rounded-full text-xs font-medium group-hover:bg-[#C0FF00]/20 transition-colors duration-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-20">
                    <Link
                        href="#"
                        data-cursor="View"
                        className="group inline-flex items-center justify-center px-10 py-5 bg-transparent text-[#020202] border-2 border-[#020202] rounded-full font-semibold text-lg overflow-hidden relative transition-transform hover:scale-105"
                    >
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                            View All Projects
                        </span>
                        <span className="absolute inset-0 bg-[#020202] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
