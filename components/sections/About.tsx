"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { number: 150, suffix: "+", label: "Projects Delivered" },
    { number: 98, suffix: "%", label: "Client Retention" },
    { number: 5, suffix: "x", label: "Average ROI" },
];

const shapes = [
    "/images/circle.png",
    "/images/half tri.png",
    "/images/multistar.png",
    "/images/circle.png",
    "/images/half tri.png",
];

interface Particle {
    element: HTMLDivElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
    radius: number;
}

export default function About() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const text1Ref = useRef<HTMLParagraphElement>(null);
    const text2Ref = useRef<HTMLParagraphElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const floatingShapesRef = useRef<HTMLDivElement[]>([]);
    const numberRefs = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

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

        // Setup Physics Simulation
        const particles: Particle[] = [];
        const gravity = 0.4;
        const friction = 0.99;
        const bounce = 0.7;

        // Physics Loop defined in outer scope
        const updatePhysics = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;

            particles.forEach(p => {
                // Apply forces
                p.vy += gravity;
                p.vx *= friction;
                p.vy *= friction;

                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.vRot;

                // Floor Collision
                if (p.y + p.radius * 2 > height) {
                    p.y = height - p.radius * 2;
                    p.vy *= -bounce;
                    p.vx *= 0.8; // More friction on ground
                    p.vRot *= 0.9;
                }

                // Wall Collision
                if (p.x + p.radius * 2 > width) {
                    p.x = width - p.radius * 2;
                    p.vx *= -bounce;
                } else if (p.x < 0) {
                    p.x = 0;
                    p.vx *= -bounce;
                }

                // Render
                gsap.set(p.element, {
                    x: p.x,
                    y: p.y,
                    rotation: p.rotation
                });
            });
        };

        // Initialize particles
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;

            floatingShapesRef.current.forEach((el, i) => {
                if (!el) return;

                // Random start position (mostly above viewport)
                const startX = Math.random() * (containerWidth - 100);
                const startY = -Math.random() * 500 - 100; // Start above

                particles.push({
                    element: el,
                    x: startX,
                    y: startY,
                    vx: (Math.random() - 0.5) * 15, // Random horizontal velocity
                    vy: Math.random() * 10,       // Initial drop velocity
                    rotation: Math.random() * 360,
                    vRot: (Math.random() - 0.5) * 10, // Angular velocity
                    radius: 40 // Approx half size
                });
            });

            // Start simulation when section comes into view
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                onEnter: () => {
                    gsap.ticker.add(updatePhysics);
                },
                onLeave: () => {
                    gsap.ticker.remove(updatePhysics);
                },
                onEnterBack: () => {
                    gsap.ticker.add(updatePhysics);
                },
                onLeaveBack: () => {
                    gsap.ticker.remove(updatePhysics);
                }
            });

            // Make draggable (interactive physics) - Optional bit of fun
            // We won't implement full Draggable here without plugin, but we can add push on hover
            particles.forEach(p => {
                p.element.addEventListener('mouseenter', () => {
                    p.vy -= 15; // Jump up
                    p.vx += (Math.random() - 0.5) * 20; // Spin away
                    p.vRot += (Math.random() - 0.5) * 50;
                });
            });
        }

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
                        start: "top 80%",
                    },
                }
            );

            // Counter animation for numbers
            numberRefs.current.forEach((numEl, i) => {
                if (!numEl) return;
                const target = stats[i].number;
                const suffix = stats[i].suffix;

                gsap.fromTo(
                    { val: 0 },
                    { val: target },
                    {
                        duration: 2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: "top 80%",
                        },
                        onUpdate: function () {
                            const currentVal = Math.round(this.targets()[0].val);
                            numEl.textContent = currentVal + suffix;
                        }
                    }
                );
            });
        }

        return () => {
            gsap.ticker.remove(updatePhysics); // Clean up ticker if active
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="py-32 md:py-48 bg-[#020202] text-white relative overflow-hidden"
        >
            {/* Physics Container */}
            <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
                {shapes.map((src, i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) floatingShapesRef.current[i] = el; }}
                        className="absolute w-20 h-20 pointer-events-auto cursor-grab active:cursor-grabbing"
                        style={{ willChange: "transform" }}
                    >
                        <Image
                            src={src}
                            alt="Floating shape"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain opacity-80"
                        />
                    </div>
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20 items-start">
                    <div>
                        <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-[#C0FF00] mb-6">
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
                            className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-12 border-t border-white/10"
                        >
                            {stats.map((stat, i) => (
                                <div key={stat.label} className="stat-item text-center">
                                    <span
                                        ref={(el) => { if (el) numberRefs.current[i] = el; }}
                                        className="block text-[clamp(3rem,6vw,5rem)] font-bold leading-none mb-3 bg-gradient-to-r from-[#8BC34A] to-[#C0FF00] bg-clip-text text-transparent font-migra"
                                    >
                                        0{stat.suffix}
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
