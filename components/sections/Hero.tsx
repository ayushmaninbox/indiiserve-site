"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SplitType from "split-type";

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
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.1 });

        // Initialize SplitType
        const text1 = new SplitType(title1Ref.current!, { types: 'lines,words' });
        const text2 = new SplitType(title2Ref.current!, { types: 'lines,words' });
        const text3 = new SplitType(title3Ref.current!, { types: 'lines,words' });

        // Set initial states
        gsap.set([taglineRef.current, descRef.current, ctaRef.current, scrollRef.current], {
            opacity: 0,
            y: 60,
        });

        // Set initial state for lines
        gsap.set([text1.lines, text2.lines, text3.lines], {
            y: "100%",
            opacity: 0
        });

        // Animate tagline
        tl.to(taglineRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
        });

        // Animate lines with stagger
        tl.to([text1.lines, text2.lines, text3.lines], {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
        }, "-=0.4");

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

        // Marquee Animation
        gsap.to(marqueeRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: "linear",
        });

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
            text1.revert();
            text2.revert();
            text3.revert();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section
            id="hero"
            className="min-h-screen flex flex-col justify-center items-center text-center px-5 md:px-20 relative bg-[#030014] overflow-hidden"
        >
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/indiserveanimation_1.mp4" type="video/mp4" />
                </video>
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/60" />
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/40 via-transparent to-[#030014]" />
            </div>

            <div ref={heroRef} className="max-w-[1100px] relative z-10">
                <p
                    ref={taglineRef}
                    className="text-sm md:text-base font-medium tracking-[0.25em] uppercase text-violet-400 mb-10"
                >
                    Strategic Consulting
                </p>

                <h1 className="text-[clamp(2.5rem,12vw,8rem)] font-bold leading-[0.95] mb-10 font-migra text-white">
                    <span className="block overflow-hidden">
                        <span ref={title1Ref} className="block">
                            We Build Stories
                        </span>
                    </span>
                    <span className="block overflow-hidden">
                        <span ref={title2Ref} className="block">
                            That Brands Can
                        </span>
                    </span>
                    <span className="block overflow-hidden">
                        <span
                            ref={title3Ref}
                            className="block text-white"
                        >
                            Grow Into.
                        </span>
                    </span>
                </h1>

                <p
                    ref={descRef}
                    className="text-base md:text-xl max-w-[750px] mx-auto mb-14 opacity-70 leading-relaxed text-white px-4 md:px-0"
                >
                    At InDiiServe, storytelling isn’t a service. It’s our core.<br className="hidden md:block" />
                    We turn businesses into narratives people remember, <br className="hidden md:block" />
                    and narratives into momentum brands can build on.
                </p>

                <div ref={ctaRef} className="flex gap-4 md:gap-5 justify-center flex-wrap px-4 md:px-0">
                    <Link
                        href="#contact"
                        data-cursor="View"
                        className="group inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 text-white rounded-full font-semibold text-base md:text-lg overflow-hidden relative transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]"
                    >
                        <span className="relative z-10">Build My Brand Story</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </Link>
                    <Link
                        href="#work"
                        data-cursor="View"
                        className="group inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 bg-white/5 backdrop-blur-sm text-white border border-violet-500/30 rounded-full font-semibold text-base md:text-lg overflow-hidden relative transition-all hover:border-violet-400 hover:bg-violet-500/10"
                    >
                        <span className="relative z-10 group-hover:text-violet-300 transition-colors duration-300">
                            Explore Our Thinking
                        </span>
                    </Link>
                </div>
            </div>

            {/* Marquee */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden whitespace-nowrap py-4 bg-[#030014]/60 backdrop-blur-sm z-10 border-t border-violet-500/20">
                <div ref={marqueeRef} className="inline-flex items-center gap-8 animate-marquee will-change-transform">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8">
                            <span className="text-white text-sm md:text-base font-migra uppercase tracking-wider">Innovative Expertise</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                            <span className="text-violet-400 text-sm md:text-base font-migra uppercase tracking-wider">Data-Driven Approach</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                            <span className="text-white text-sm md:text-base font-migra uppercase tracking-wider">Tailored Solutions</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                            <span className="text-violet-400 text-sm md:text-base font-migra uppercase tracking-wider">Scalable Innovation</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
