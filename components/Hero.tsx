"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const title1Ref = useRef<HTMLSpanElement>(null);
    const title2Ref = useRef<HTMLSpanElement>(null);
    const title3Ref = useRef<HTMLSpanElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 2.5 }); // Wait for loader

        // Set initial states
        gsap.set([taglineRef.current, descRef.current, ctaRef.current, scrollRef.current], {
            opacity: 0,
            y: 60,
        });

        gsap.set([title1Ref.current, title2Ref.current, title3Ref.current], {
            yPercent: 100,
        });

        // Animate tagline
        tl.to(taglineRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
        });

        // Animate title lines with stagger
        tl.to(
            [title1Ref.current, title2Ref.current, title3Ref.current],
            {
                yPercent: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.1,
            },
            "-=0.4"
        );

        // Animate description
        tl.to(
            descRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            },
            "-=0.5"
        );

        // Animate CTA buttons
        tl.to(
            ctaRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            },
            "-=0.4"
        );

        // Animate scroll indicator
        tl.to(
            scrollRef.current,
            {
                opacity: 0.6,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            },
            "-=0.3"
        );

        // Parallax effect on scroll
        gsap.to(heroRef.current, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section
            id="hero"
            className="min-h-screen flex flex-col justify-center items-center text-center px-5 md:px-20 relative bg-[#020202] overflow-hidden"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,255,0,0.08)_0%,transparent_60%)] pointer-events-none" />

            {/* Floating shapes */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C0FF00]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C0FF00]/3 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

            <div ref={heroRef} className="max-w-[1100px] relative z-10">
                <p
                    ref={taglineRef}
                    className="text-sm md:text-base font-medium tracking-[0.25em] uppercase text-[#C0FF00] mb-10"
                >
                    Digital Marketing Consultancy
                </p>

                <h1 className="text-[clamp(3.5rem,12vw,8rem)] font-bold leading-[0.95] mb-10 font-migra">
                    <span className="block overflow-hidden">
                        <span ref={title1Ref} className="block">
                            Transform Your
                        </span>
                    </span>
                    <span className="block overflow-hidden">
                        <span ref={title2Ref} className="block">
                            Business with
                        </span>
                    </span>
                    <span className="block overflow-hidden">
                        <span ref={title3Ref} className="block text-[#C0FF00]">
                            InDiiServe
                        </span>
                    </span>
                </h1>

                <p
                    ref={descRef}
                    className="text-lg md:text-xl max-w-[650px] mx-auto mb-14 opacity-70 leading-relaxed"
                >
                    We provide cutting-edge digital marketing consultancy services that
                    leverage data-driven strategies and innovative campaigns to drive your
                    business forward in the digital age.
                </p>

                <div ref={ctaRef} className="flex gap-5 justify-center flex-wrap">
                    <Link
                        href="#contact"
                        data-cursor="View"
                        className="group inline-flex items-center justify-center px-10 py-5 bg-[#C0FF00] text-[#020202] rounded-full font-semibold text-lg overflow-hidden relative transition-transform hover:scale-105"
                    >
                        <span className="relative z-10">Start Your Journey</span>
                        <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </Link>
                    <Link
                        href="#work"
                        data-cursor="View"
                        className="group inline-flex items-center justify-center px-10 py-5 bg-transparent text-white border-2 border-white/30 rounded-full font-semibold text-lg overflow-hidden relative transition-all hover:border-white"
                    >
                        <span className="relative z-10 group-hover:text-[#020202] transition-colors duration-300">
                            View Our Work
                        </span>
                        <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                ref={scrollRef}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-xs tracking-[0.15em] uppercase"
            >
                <span>Scroll to explore</span>
                <div className="w-6 h-12 border-2 border-current rounded-full relative">
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-[#C0FF00] rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
}
