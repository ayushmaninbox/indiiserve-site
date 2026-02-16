"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        quote:
            "InDiiServe transformed our digital presence completely. Their data-driven approach and creative strategies resulted in a 300% increase in online engagement.",
        name: "Sarah Mitchell",
        role: "CEO, TechFlow Commerce",
        gradient: "from-indigo-500 to-violet-500",
    },
    {
        quote:
            "The team brings a perfect blend of analytical thinking and creative execution. They understood our unique challenges and delivered exceptional results.",
        name: "Dr. James Chen",
        role: "Founder, MedCare Solutions",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        quote:
            "Working with InDiiServe has been transformative. Their strategic insights and flawless execution made them an invaluable extension of our team.",
        name: "Michael Roberts",
        role: "CMO, PaySwift Finance",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        quote:
            "A game-changer for our brand. The level of detail and dedication they bring to every project is unmatched in the industry. Truly a premium partner.",
        name: "Elena Rodriguez",
        role: "Director, Luxe Interiors",
        gradient: "from-blue-500 to-indigo-500",
    },
];

export default function Testimonials() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Animate title
        gsap.fromTo(
            ".testimonials-title",
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".testimonials-header",
                    start: "top 85%",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    // 3D Carousel Animation
    useEffect(() => {
        const cards = document.querySelectorAll(".testimonial-card");
        const spacing = 100;

        cards.forEach((card, index) => {
            const distanceFromCenter = Math.abs(index - currentIndex);
            const scale = distanceFromCenter === 0 ? 1 : 0.85;
            const opacity = distanceFromCenter === 0 ? 1 : 0.4;
            const zIndex = distanceFromCenter === 0 ? 10 : 0;
            const rotateY = (index - currentIndex) * -15;

            gsap.to(card, {
                xPercent: (index - currentIndex) * 110,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
                rotateY: rotateY,
                duration: 0.8,
                ease: "power3.out",
            });
        });
    }, [currentIndex]);

    // Auto-rotation
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            className="py-20 md:py-48 bg-transparent text-white overflow-hidden perspective-[1000px]"
        >
            <div className="max-w-[1400px] mx-auto px-5 md:px-20">
                <div className="testimonials-header text-center max-w-[900px] mx-auto mb-20">
                    <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-violet-400 mb-6">
                        Client Success
                    </span>
                    <h2 className="testimonials-title text-[clamp(2.5rem,6vw,4rem)] font-semibold font-migra leading-[1.1] text-white">
                        Words from our{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">valued partners</span>
                    </h2>
                </div>

                <div
                    className="relative h-[500px] flex items-center justify-center perspective-[1200px]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div ref={trackRef} className="absolute inset-0 flex items-center justify-center w-full h-full">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="testimonial-card absolute w-full max-w-[800px] px-8 py-12 md:p-16 glass-card rounded-3xl text-center origin-center backface-hidden"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className="text-6xl text-violet-400 font-migra leading-none mb-8 opacity-50">
                                    &ldquo;
                                </div>

                                <p className="text-[clamp(1.2rem,2.5vw,1.75rem)] leading-relaxed font-light mb-12 opacity-90 text-white">
                                    {testimonial.quote}
                                </p>

                                <div className="flex items-center justify-center gap-5">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.gradient}`} />
                                    <div className="text-left">
                                        <div className="text-lg font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-sm opacity-50 uppercase tracking-widest text-white">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-8 mt-12">
                    <button
                        onClick={handlePrev}
                        className="w-14 h-14 rounded-full border border-violet-500/30 flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-transparent transition-all duration-300 group"
                        data-cursor="Prev"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex gap-3 items-center">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-gradient-to-r from-indigo-500 to-violet-500" : "w-2 bg-white/20 hover:bg-violet-500/50"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-14 h-14 rounded-full border border-violet-500/30 flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-transparent transition-all duration-300 group"
                        data-cursor="Next"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
