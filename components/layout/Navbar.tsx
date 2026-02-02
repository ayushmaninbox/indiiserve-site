"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EnquiryModal from "@/components/ui/EnquiryModal";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "400px top",
                    scrub: 0.5,
                }
            });

            tl.to(navRef.current, {
                left: "50%",
                xPercent: -50,
                duration: 1,
                ease: "none"
            });

            tl.fromTo(bgRef.current,
                { backgroundColor: "rgba(2, 2, 2, 0.6)", borderColor: "rgba(255, 255, 255, 0.08)" },
                { backgroundColor: "rgba(2, 2, 2, 0.95)", borderColor: "rgba(255, 255, 255, 0.2)", duration: 1 },
                "<"
            );

        }, navRef);

        return () => ctx.revert();
    }, []);

    // Mobile Menu Animation
    useEffect(() => {
        if (isOpen) {
            gsap.to(".mobile-menu", {
                opacity: 1,
                pointerEvents: "all",
                duration: 0.5,
                ease: "power3.out",
            });
            gsap.fromTo(
                ".mobile-link",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: "power3.out",
                }
            );
        } else {
            gsap.to(".mobile-menu", {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.4,
                ease: "power3.in",
            });
        }
    }, [isOpen]);

    const navLinks = [
        { href: "/services", label: "Services" },
        { href: "#work", label: "Work" },
        { href: "#about", label: "About" },
        { href: "#faq", label: "FAQ" },
        { href: "/blog", label: "Blog" },
    ];

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-8 left-5 md:left-20 z-[5000] w-auto"
            >
                <div className="relative">
                    {/* Glass Background Layer */}
                    <div
                        ref={bgRef}
                        className="absolute inset-0 rounded-full backdrop-blur-2xl bg-white/15 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
                    />

                    {/* Content Layer */}
                    <div className="relative z-10 flex items-center gap-2 md:gap-8 px-6 py-3">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="font-migra text-xl font-bold text-[#C0FF00] mr-4"
                            data-cursor="home"
                        >
                            InDiiServe
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex gap-8" style={{ mixBlendMode: 'difference' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-white hover:opacity-70 transition-opacity relative group"
                                    data-cursor="link"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Enquire Now Button - Desktop */}
                        <button
                            onClick={() => setIsEnquiryOpen(true)}
                            className="hidden md:block ml-4 rounded-full bg-lime-400 px-5 py-2 text-sm font-bold text-black transition-all hover:bg-lime-300 hover:scale-105"
                        >
                            Enquire Now
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden ml-auto p-2"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-5 relative flex flex-col justify-between">
                                <span
                                    className={`block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2.5 bg-[#C0FF00]" : ""
                                        }`}
                                />
                                <span
                                    className={`block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""
                                        }`}
                                />
                                <span
                                    className={`block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2 bg-[#C0FF00]" : ""
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className="mobile-menu fixed inset-0 z-[4000] bg-[#020202]/95 backdrop-blur-xl opacity-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="flex flex-col gap-8 text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="mobile-link text-3xl font-migra font-bold text-white hover:text-[#C0FF00] transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {/* Enquire Now Button - Mobile */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setIsEnquiryOpen(true);
                        }}
                        className="mobile-link mt-4 rounded-full bg-lime-400 px-8 py-4 text-lg font-bold text-black transition-all hover:bg-lime-300"
                    >
                        Enquire Now
                    </button>
                </div>
            </div>

            {/* Enquiry Modal */}
            <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
        </>
    );
}
