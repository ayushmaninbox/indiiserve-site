"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { number: 150, suffix: "+", label: "Projects Delivered" },
    { number: 98, suffix: "%", label: "Client Retention" },
    { number: 5, suffix: "x", label: "Average ROI" },
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

    const labelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Hide label and physics shapes initially and show on scroll
        const ctx = gsap.context(() => {
            gsap.fromTo(
                [labelRef.current, containerRef.current],
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: true,
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Physics simulation
        const particles: Particle[] = [];
        const gravity = 0.4;
        const friction = 0.99;
        const bounce = 0.7;

        const updatePhysics = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;

            particles.forEach(p => {
                p.vy += gravity;
                p.vx *= friction;
                p.vy *= friction;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.vRot;

                if (p.y + p.radius * 2 > height) {
                    p.y = height - p.radius * 2;
                    p.vy *= -bounce;
                    p.vx *= 0.8;
                    p.vRot *= 0.9;
                }

                if (p.x + p.radius * 2 > width) {
                    p.x = width - p.radius * 2;
                    p.vx *= -bounce;
                } else if (p.x < 0) {
                    p.x = 0;
                    p.vx *= -bounce;
                }

                gsap.set(p.element, {
                    x: p.x,
                    y: p.y,
                    rotation: p.rotation
                });
            });
        };

        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;

            if (isTouchDevice) {
                // Static non-overlapping positioning for mobile
                const staticPositions = [
                    { x: 10, y: 15 }, // Top Left
                    { x: 75, y: 20 }, // Top Right
                    { x: 35, y: 45 }, // Middle
                    { x: 15, y: 70 }, // Bottom Left
                    { x: 80, y: 75 }  // Bottom Right
                ];

                floatingShapesRef.current.forEach((el, i) => {
                    if (!el) return;
                    const pos = staticPositions[i];

                    // Simple entrance: Fall from top then stay static
                    gsap.fromTo(el,
                        {
                            x: `${pos.x}%`,
                            y: -200,
                            opacity: 0,
                            rotation: Math.random() * 360
                        },
                        {
                            y: () => (containerHeight * (pos.y / 100)),
                            opacity: 0.5,
                            duration: 1.5,
                            delay: i * 0.2,
                            ease: "bounce.out",
                            scrollTrigger: {
                                trigger: section,
                                start: "top 60%",
                            }
                        }
                    );
                });
            } else {
                // Desktop Physics Path
                floatingShapesRef.current.forEach((el, i) => {
                    if (!el) return;

                    const startX = Math.random() * (containerWidth - 100);
                    const startY = -Math.random() * 500 - 100;

                    particles.push({
                        element: el,
                        x: startX,
                        y: startY,
                        vx: (Math.random() - 0.5) * 15,
                        vy: Math.random() * 10,
                        rotation: Math.random() * 360,
                        vRot: (Math.random() - 0.5) * 10,
                        radius: 40
                    });
                });

                ScrollTrigger.create({
                    trigger: section,
                    start: "top center",
                    onEnter: () => gsap.ticker.add(updatePhysics),
                    onLeave: () => gsap.ticker.remove(updatePhysics),
                    onEnterBack: () => gsap.ticker.add(updatePhysics),
                    onLeaveBack: () => gsap.ticker.remove(updatePhysics)
                });

                particles.forEach(p => {
                    p.element.addEventListener('mouseenter', () => {
                        p.vy -= 15;
                        p.vx += (Math.random() - 0.5) * 20;
                        p.vRot += (Math.random() - 0.5) * 50;
                    });
                });
            }
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

        // Text animations
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
            gsap.ticker.remove(updatePhysics);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="py-20 md:py-48 bg-transparent text-white relative overflow-hidden"
        >
            {/* Physics Container */}
            <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) floatingShapesRef.current[i] = el; }}
                        className="absolute w-16 h-16 pointer-events-auto cursor-grab active:cursor-grabbing"
                        style={{ willChange: "transform" }}
                    >
                        <svg viewBox="0 0 80 80" className="w-full h-full opacity-50">
                            {/* Retro starburst — white */}
                            {i === 0 && (
                                <path d="M40 4 L46 28 L68 12 L52 34 L76 40 L52 46 L68 68 L46 52 L40 76 L34 52 L12 68 L28 46 L4 40 L28 34 L12 12 L34 28 Z" fill="#ffffff" />
                            )}
                            {/* Retro half-circle — violet */}
                            {i === 1 && (
                                <path d="M12 56 A28 28 0 0 1 68 56 Z" fill="#8b5cf6" />
                            )}
                            {/* Retro cross/plus — white */}
                            {i === 2 && (
                                <path d="M30 8 H50 V30 H72 V50 H50 V72 H30 V50 H8 V30 H30 Z" fill="#ffffff" />
                            )}
                            {/* Retro donut ring — violet */}
                            {i === 3 && (
                                <>
                                    <circle cx="40" cy="40" r="30" fill="#a78bfa" />
                                    <circle cx="40" cy="40" r="14" fill="#030014" />
                                </>
                            )}
                            {/* Retro diamond — white */}
                            {i === 4 && (
                                <polygon points="40,6 70,40 40,74 10,40" fill="#ffffff" />
                            )}
                        </svg>
                    </div>
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-20 items-start">
                    <div ref={labelRef}>
                        <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-violet-400 mb-6">
                            OUR MISSION
                        </span>
                    </div>

                    <div>
                        <h2
                            ref={titleRef}
                            className="text-[clamp(2rem,4vw,3.5rem)] font-semibold mb-10 font-migra leading-[1.2] text-white"
                        >
                            Beyond Service, <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                                We Deliver Transformation.
                            </span>
                        </h2>

                        <div className="space-y-6 text-lg md:text-xl leading-relaxed opacity-80 text-white mb-16">
                            <p ref={text1Ref}>
                                We are not a service provider; we are your strategic growth partner and dedicated problem-solvers. Built on the bedrock of over 60+ years of collective, hands-on experience from our four visionary founders and directors, we know that success in today&apos;s complex landscape demands more than just advice—it demands actionable, integrated solutions.
                            </p>
                            <div ref={text2Ref} className="space-y-4">
                                <p>Our comprehensive suite of expertise spans the critical needs of modern business:</p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-violet-300 font-medium">
                                    <li>• Business Consultation</li>
                                    <li>• Talent Acquisition</li>
                                    <li>• Company Compliance</li>
                                    <li>• Digital Marketing</li>
                                    <li>• Learning Solutions</li>
                                    <li>• BPM</li>
                                    <li>• AI & Automation</li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-violet-500/20 mb-16">
                            <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-violet-400 mb-6">
                                OUR APPROACH
                            </span>
                            <h3 className="text-2xl md:text-3xl font-semibold mb-6 font-migra text-white">
                                Turning Roadblocks into <span className="text-violet-400">Runways for Growth.</span>
                            </h3>
                            <p className="text-lg opacity-70 leading-relaxed text-white max-w-[800px]">
                                We immerse ourselves in your world, identifying the root causes of stagnation and crafting custom strategies that lead to tangible, measurable results. When you partner with us, you gain a team committed to your long-term prosperity.
                            </p>
                        </div>

                        <div
                            ref={statsRef}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-12 border-t border-violet-500/20"
                        >
                            {stats.map((stat, i) => (
                                <div key={stat.label} className="stat-item text-center">
                                    <span
                                        ref={(el) => { if (el) numberRefs.current[i] = el; }}
                                        className="block text-[clamp(3rem,6vw,5rem)] font-bold leading-none mb-3 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent font-migra"
                                    >
                                        0{stat.suffix}
                                    </span>
                                    <span className="text-sm uppercase tracking-[0.1em] opacity-60 text-white">
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
