"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EnquiryModal from "@/components/ui/EnquiryModal";

gsap.registerPlugin(ScrollTrigger);

import { LayoutGrid, Bot, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const serviceDropdownItems = [
    { href: "/services/digital-branding", label: "Digital Branding", icon: <LayoutGrid className="w-4 h-4" /> },
    { href: "/services/ai-automation", label: "AI & Automation", icon: <Bot className="w-4 h-4" /> },
    { href: "/services/recruitment", label: "Recruitment", icon: <Users className="w-4 h-4" /> },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

            tl.fromTo(bgRef.current,
                { backgroundColor: "rgba(3, 0, 20, 0.6)", borderColor: "rgba(139, 92, 246, 0.1)" },
                { backgroundColor: "rgba(3, 0, 20, 0.95)", borderColor: "rgba(139, 92, 246, 0.3)", duration: 1 }
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

    const handleServicesMouseEnter = () => {
        if (servicesTimeoutRef.current) {
            clearTimeout(servicesTimeoutRef.current);
        }
        setIsServicesOpen(true);
    };

    const handleServicesMouseLeave = () => {
        servicesTimeoutRef.current = setTimeout(() => {
            setIsServicesOpen(false);
        }, 150);
    };

    const navLinks = [
        { href: "/work", label: "Work" },
        { href: "#about", label: "About" },
        { href: "#faq", label: "FAQ" },
        { href: "/blog", label: "Blog" },
    ];

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-[5000] w-auto"
            >
                <div className="relative">
                    {/* Glass Background Layer */}
                    <div
                        ref={bgRef}
                        className="absolute inset-0 rounded-full backdrop-blur-2xl bg-[#030014]/60 border border-violet-500/20 shadow-[0_8px_32px_rgba(139,92,246,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]"
                    />

                    {/* Content Layer */}
                    <div className="relative z-10 flex items-center gap-2 md:gap-8 px-6 py-3">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center mr-4"
                            data-cursor="home"
                        >
                            <img src="/white version.png" alt="InDiiServe" className="h-8 w-auto" />
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex gap-8" style={{ mixBlendMode: 'difference' }}>
                            {/* Services Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={handleServicesMouseEnter}
                                onMouseLeave={handleServicesMouseLeave}
                            >
                                <button
                                    className="text-xs uppercase tracking-widest font-sans font-bold text-white hover:opacity-70 transition-opacity relative group flex items-center gap-1.5"
                                >
                                    Services
                                    <svg
                                        className={`w-3 h-3 transition-transform ${isServicesOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="absolute -bottom-1 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300" />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${isServicesOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                                        }`}
                                    style={{ mixBlendMode: 'normal' }}
                                >
                                    <div className="bg-[#030014]/90 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-3 min-w-[220px] shadow-[0_8px_32px_rgba(139,92,246,0.2)]">
                                        {serviceDropdownItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="no-cursor flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-sans font-bold text-neutral-300 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                            >
                                                <span className="text-violet-400">{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        ))}
                                        <div className="border-t border-violet-500/20 mt-2 pt-2">
                                            <Link
                                                href="/services"
                                                className="no-cursor flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-sans font-bold text-neutral-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                            >
                                                View All Services →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="no-cursor text-xs uppercase tracking-widest font-sans font-bold text-white hover:opacity-70 transition-opacity relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Enquire Now Button - Desktop */}
                        <button
                            onClick={() => setIsEnquiryOpen(true)}
                            className="no-cursor hidden md:block ml-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-xs uppercase tracking-widest font-sans font-bold text-white transition-all hover:from-indigo-400 hover:to-violet-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
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
                                    className={`block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2.5 bg-violet-400" : ""
                                        }`}
                                />
                                <span
                                    className={`block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""
                                        }`}
                                />
                                <span
                                    className={`block w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2 bg-violet-400" : ""
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className="mobile-menu fixed inset-0 z-[4000] bg-[#030014]/95 backdrop-blur-xl opacity-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="flex flex-col gap-6 text-center">
                    {/* Services Section */}
                    <div className="mobile-link">
                        <span className="text-xs uppercase tracking-widest text-violet-400 mb-4 block">Services</span>
                        <div className="flex flex-col gap-3">
                            {serviceDropdownItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-2xl font-sans uppercase tracking-widest font-bold text-white hover:text-violet-400 transition-colors flex items-center justify-center gap-3"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-violet-400">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent mx-auto my-2" />

                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="mobile-link text-3xl font-sans uppercase tracking-widest font-bold text-white hover:text-violet-400 transition-colors"
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
                        className="mobile-link mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-4 text-lg uppercase tracking-widest font-sans font-bold text-white transition-all hover:from-indigo-400 hover:to-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
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
