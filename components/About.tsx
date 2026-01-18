"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { number: "150+", label: "Projects Delivered" },
    { number: "98%", label: "Client Retention" },
    { number: "5x", label: "Average ROI" },
];

export default function About() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const text1Ref = useRef<HTMLParagraphElement>(null);
    const text2Ref = useRef<HTMLParagraphElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Background color change
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

        // Title animation
        gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 80 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 85%",
                },
            }
        );

        // Text animations with stagger
        const texts = [text1Ref.current, text2Ref.current];
        texts.forEach((text, i) => {
            gsap.fromTo(
                text,
                { opacity: 0, y: 50 },
                {
                    opacity: 0.8,
                    y: 0,
                    duration: 0.8,
                    delay: i * 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: text,
                        start: "top 85%",
                    },
                }
            );
        });

        // Stats animation
        if (statsRef.current) {
            const statItems = statsRef.current.querySelectorAll(".stat-item");
            gsap.fromTo(
                statItems,
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 85%",
                    },
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="py-32 md:py-48 bg-[#FBFBF4] text-[#020202]"
        >
            <div className="max-w-[1400px] mx-auto px-5 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20 items-start">
                    <div>
                        <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-[#4a7c10] mb-6">
                            Who We Are
                        </span>
                    </div>

                    <div>
                        <h2
                            ref={titleRef}
                            className="text-[clamp(2.5rem,5vw,4rem)] font-semibold mb-10 font-migra leading-[1.1]"
                        >
                            Crafting Digital Excellence Through{" "}
                            <span className="bg-gradient-to-r from-[#8BC34A] to-[#C0FF00] bg-clip-text text-transparent">
                                Strategy & Innovation
                            </span>
                        </h2>

                        <p
                            ref={text1Ref}
                            className="text-xl leading-relaxed mb-8 opacity-80"
                        >
                            InDiiServe is a forward-thinking digital marketing consultancy
                            that combines data analytics with creative strategy. We partner
                            with ambitious brands to unlock growth opportunities and build
                            meaningful connections with their audiences.
                        </p>

                        <p
                            ref={text2Ref}
                            className="text-xl leading-relaxed mb-16 opacity-80"
                        >
                            Our promise is simple: to guide you with expertise, transparency,
                            and a relentless focus on results. From startups to enterprises,
                            we pour the same dedication and strategic thinking into every
                            project.
                        </p>

                        <div
                            ref={statsRef}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-12 border-t border-[#020202]/10"
                        >
                            {stats.map((stat) => (
                                <div key={stat.label} className="stat-item text-center">
                                    <span className="block text-[clamp(3rem,6vw,5rem)] font-bold leading-none mb-3 bg-gradient-to-r from-[#8BC34A] to-[#C0FF00] bg-clip-text text-transparent font-migra">
                                        {stat.number}
                                    </span>
                                    <span className="text-sm uppercase tracking-[0.1em] opacity-60">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
