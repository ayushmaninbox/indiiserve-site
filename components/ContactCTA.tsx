"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function ContactCTA() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
            },
            onLeaveBack: () => {
                gsap.to("body", {
                    backgroundColor: "#FBFBF4",
                    duration: 0.5,
                    ease: "power2.out",
                });
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

    return (
        <section ref={sectionRef} id="contact" className="py-32 md:py-48 bg-[#020202] text-white text-center">
            <div ref={containerRef} className="max-w-[800px] mx-auto px-5">
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
                        data-cursor="Email"
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
                    >
                        hello@indiiserve.com
                    </Link>
                    <Link
                        href="tel:+1234567890"
                        className="hover:text-[#C0FF00] hover:opacity-100 transition-all"
                    >
                        +1 (234) 567-890
                    </Link>
                </div>
            </div>
        </section>
    );
}
