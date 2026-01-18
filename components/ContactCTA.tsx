"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const textElements = [
    { src: "/Assets/Text Elements/Build.png", width: 240, height: 80 },
    { src: "/Assets/Text Elements/Develop.png", width: 280, height: 80 },
    { src: "/Assets/Text Elements/Expand.png", width: 260, height: 80 },
    { src: "/Assets/Text Elements/Scale.png", width: 220, height: 80 },
];

interface PhysicsElement {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    isDragging: boolean;
}

export default function ContactCTA() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const boundaryRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<HTMLDivElement[]>([]);
    const physicsRef = useRef<PhysicsElement[]>([]);
    const [isActive, setIsActive] = useState(false);
    const dragIndexRef = useRef<number | null>(null);
    const dragOffsetRef = useRef({ x: 0, y: 0 });

    // Initialize physics state
    useEffect(() => {
        physicsRef.current = textElements.map((el, i) => ({
            x: 100 + i * 250,
            y: -100 - i * 60,
            vx: (Math.random() - 0.5) * 3,
            vy: 0,
            width: el.width,
            height: el.height,
            isDragging: false,
        }));
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Background color transition to dark
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
                setIsActive(true);
            },
            onLeaveBack: () => {
                gsap.to("body", {
                    backgroundColor: "#FBFBF4",
                    duration: 0.5,
                    ease: "power2.out",
                });
                setIsActive(false);
            },
        });

        // Animate content
        gsap.fromTo(
            ".contact-reveal",
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    // Physics Engine - with floor padding to prevent entering footer
    useEffect(() => {
        if (!isActive) return;

        const boundary = boundaryRef.current;
        if (!boundary) return;

        const gravity = 0.3;
        const friction = 0.98;
        const bounce = 0.6;
        const floorPadding = 120; // Keep elements away from footer

        const updatePhysics = () => {
            const rect = boundary.getBoundingClientRect();
            const boundaryWidth = rect.width;
            const boundaryHeight = rect.height - floorPadding; // Reduced floor

            physicsRef.current.forEach((el, i) => {
                if (el.isDragging) return;

                // Apply gravity
                el.vy += gravity;

                // Apply friction
                el.vx *= friction;
                el.vy *= friction;

                // Update position
                el.x += el.vx;
                el.y += el.vy;

                // Boundary collisions (floor with padding)
                if (el.y + el.height > boundaryHeight) {
                    el.y = boundaryHeight - el.height;
                    el.vy *= -bounce;
                }

                // Ceiling collision
                if (el.y < 0) {
                    el.y = 0;
                    el.vy *= -bounce;
                }

                // Boundary collisions (walls)
                if (el.x < 0) {
                    el.x = 0;
                    el.vx *= -bounce;
                }
                if (el.x + el.width > boundaryWidth) {
                    el.x = boundaryWidth - el.width;
                    el.vx *= -bounce;
                }

                // Update DOM - FORCE no rotation
                if (elementsRef.current[i]) {
                    elementsRef.current[i].style.transform = `translate(${el.x}px, ${el.y}px) rotate(0deg)`;
                }
            });
        };

        gsap.ticker.add(updatePhysics);
        return () => gsap.ticker.remove(updatePhysics);
    }, [isActive]);

    // Mouse Handlers for Dragging
    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        const boundary = boundaryRef.current;
        if (!boundary) return;

        const rect = boundary.getBoundingClientRect();
        const el = physicsRef.current[index];

        dragIndexRef.current = index;
        el.isDragging = true;
        dragOffsetRef.current = {
            x: e.clientX - rect.left - el.x,
            y: e.clientY - rect.top - el.y,
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragIndexRef.current === null) return;

        const boundary = boundaryRef.current;
        if (!boundary) return;

        const rect = boundary.getBoundingClientRect();
        const index = dragIndexRef.current;
        const el = physicsRef.current[index];

        const newX = e.clientX - rect.left - dragOffsetRef.current.x;
        const newY = e.clientY - rect.top - dragOffsetRef.current.y;

        // Calculate velocity from movement
        el.vx = (newX - el.x) * 0.3;
        el.vy = (newY - el.y) * 0.3;

        el.x = newX;
        el.y = newY;

        if (elementsRef.current[index]) {
            elementsRef.current[index].style.transform = `translate(${el.x}px, ${el.y}px) rotate(0deg)`;
        }
    };

    const handleMouseUp = () => {
        if (dragIndexRef.current !== null) {
            physicsRef.current[dragIndexRef.current].isDragging = false;
            dragIndexRef.current = null;
        }
    };

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="py-32 md:py-48 bg-[#020202] text-white text-center relative overflow-hidden"
        >
            {/* Physics Boundary */}
            <div
                ref={boundaryRef}
                className="absolute inset-0 pointer-events-none"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
            >
                {textElements.map((el, i) => (
                    <div
                        key={i}
                        ref={(ref) => { if (ref) elementsRef.current[i] = ref; }}
                        className="absolute cursor-grab active:cursor-grabbing select-none"
                        onMouseDown={(e) => handleMouseDown(e, i)}
                        data-cursor="interact"
                        style={{
                            willChange: 'transform',
                            pointerEvents: 'auto',
                        }}
                    >
                        <Image
                            src={el.src}
                            alt={`Text element ${i + 1}`}
                            width={el.width}
                            height={el.height}
                            className="opacity-40 hover:opacity-70 transition-opacity pointer-events-none"
                            draggable={false}
                        />
                    </div>
                ))}
            </div>

            <div ref={containerRef} className="max-w-[800px] mx-auto px-5 relative z-10">
                <span className="contact-reveal inline-block text-sm font-medium tracking-[0.15em] uppercase text-[#C0FF00] mb-8">
                    Let&apos;s Connect
                </span>

                <h2 className="contact-reveal text-[clamp(3.5rem,10vw,7rem)] font-bold font-migra mb-8 leading-[0.9]">
                    Ready to <span className="text-[#C0FF00]">Grow?</span>
                </h2>

                <p className="contact-reveal text-xl md:text-2xl opacity-70 mb-16 max-w-[600px] mx-auto">
                    Let&apos;s discuss how we can transform your digital presence and
                    drive real business results.
                </p>

                <div className="contact-reveal mb-16">
                    <Link
                        href="mailto:hello@indiiserve.com"
                        className="group inline-flex items-center justify-center px-12 py-6 bg-[#C0FF00] text-[#020202] rounded-full text-xl font-bold overflow-hidden relative transition-transform hover:scale-105"
                        data-cursor="email"
                    >
                        <span className="relative z-10">Start a Conversation</span>
                        <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        <span className="absolute right-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
                            →
                        </span>
                    </Link>
                </div>

                <div className="contact-reveal flex justify-center gap-12 flex-wrap text-sm uppercase tracking-widest opacity-60">
                    <Link
                        href="mailto:hello@indiiserve.com"
                        className="hover:text-[#C0FF00] hover:opacity-100 transition-all"
                        data-cursor="link"
                    >
                        hello@indiiserve.com
                    </Link>
                    <Link
                        href="tel:+1234567890"
                        className="hover:text-[#C0FF00] hover:opacity-100 transition-all"
                        data-cursor="link"
                    >
                        +1 (234) 567-890
                    </Link>
                </div>
            </div>
        </section>
    );
}
