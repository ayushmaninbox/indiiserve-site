"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEnquiry } from "@/context/EnquiryContext";
import { LayoutGrid, Bot, Users, ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const serviceDropdownItems = [
    { href: "/services/digital-branding", label: "Digital Branding", icon: <LayoutGrid className="w-4 h-4" /> },
    { href: "/services/ai-automation", label: "AI & Automation", icon: <Bot className="w-4 h-4" /> },
    { href: "/services/recruitment", label: "Recruitment", icon: <Users className="w-4 h-4" /> },
];

const navLinks = [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { openEnquiry } = useEnquiry();
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial load animation
            gsap.from(containerRef.current, {
                y: -50,
                opacity: 0,
                duration: 1.2,
                ease: "expo.out",
                delay: 0.5
            });

            // Scroll animation
            ScrollTrigger.create({
                start: "top top",
                end: "100px top",
                onToggle: (self) => {
                    if (self.isActive) {
                        gsap.to(bgRef.current, {
                            backgroundColor: "rgba(3, 0, 20, 0.9)",
                            borderColor: "rgba(139, 92, 246, 0.3)",
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                            duration: 0.4
                        });
                        gsap.to(navRef.current, {
                            top: "1.5rem",
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    } else {
                        gsap.to(bgRef.current, {
                            backgroundColor: "rgba(3, 0, 20, 0.4)",
                            borderColor: "rgba(139, 92, 246, 0.1)",
                            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                            duration: 0.4
                        });
                        gsap.to(navRef.current, {
                            top: "2rem",
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                }
            });
        }, navRef);

        return () => ctx.revert();
    }, []);

    // Mobile Menu Animation
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            gsap.to(".mobile-menu", {
                opacity: 1,
                pointerEvents: "all",
                duration: 0.6,
                ease: "expo.out",
            });
            gsap.fromTo(
                ".mobile-link",
                { opacity: 0, y: 30, skewY: 5 },
                {
                    opacity: 1,
                    y: 0,
                    skewY: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    delay: 0.3,
                    ease: "expo.out",
                }
            );
        } else {
            document.body.style.overflow = "unset";
            gsap.to(".mobile-menu", {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.4,
                ease: "power2.in",
            });
        }
    }, [isOpen]);

    const handleServicesMouseEnter = () => {
        if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
        setIsServicesOpen(true);
    };

    const handleServicesMouseLeave = () => {
        servicesTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 200);
    };

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-[5000] w-auto transition-all duration-500"
            >
                <div ref={containerRef} className="relative group">
                    {/* Pulsing Border Glow */}
                    <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-sm" />

                    {/* Glass Background */}
                    <div
                        ref={bgRef}
                        className="absolute inset-0 rounded-full backdrop-blur-xl bg-[#030014]/40 border border-violet-500/10 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    />

                    {/* Navbar content */}
                    <div className="relative z-10 flex items-center h-14 px-6 md:px-8">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center mr-8 group/logo"
                            data-cursor="home"
                        >
                            <img src="/white_logo.png" alt="InDiiServe" className="h-7 w-auto transition-transform duration-500 group-hover/logo:scale-105" />
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-7">
                            {/* Services Dropdown */}
                            <div
                                className="relative py-4"
                                onMouseEnter={handleServicesMouseEnter}
                                onMouseLeave={handleServicesMouseLeave}
                            >
                                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">
                                    Services
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${isServicesOpen ? "rotate-180" : ""}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute top-[90%] left-1/2 -translate-x-1/2 pt-4 transition-all duration-500 ${isServicesOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"}`}>
                                    <div className="bg-[#030014]/95 backdrop-blur-3xl border border-white/5 rounded-3xl p-3 min-w-[260px] shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_20px_rgba(139,92,246,0.1)]">
                                        <div className="px-4 py-2 mb-2 border-b border-white/5">
                                            <p className="text-[10px] font-black text-violet-400/60 uppercase tracking-widest italic">Core Expertise</p>
                                        </div>
                                        {serviceDropdownItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center justify-between group/item px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-violet-500 group-hover/item:scale-110 transition-transform duration-300">{item.icon}</span>
                                                    {item.label}
                                                </div>
                                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors group/nav"
                                >
                                    {link.label}
                                    <span className="absolute bottom-3 left-0 w-full h-[2px] bg-violet-500 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-500 origin-right group-hover/nav:origin-left" />
                                </Link>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="flex items-center gap-4 ml-8">
                            <button
                                onClick={openEnquiry}
                                className="hidden md:flex items-center gap-2 relative overflow-hidden rounded-full bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-violet-500 hover:text-white group/cta"
                            >
                                <span className="relative z-10">Start Project</span>
                                <Send className="w-3 h-3 relative z-10 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform" />
                            </button>

                            {/* Mobile Toggle */}
                            <button
                                className="md:hidden p-2 text-white hover:text-violet-400 transition-colors"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className="mobile-menu fixed inset-0 z-[4900] bg-[#030014]/98 backdrop-blur-3xl opacity-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center gap-10">
                    <img src="/white_logo.png" alt="InDiiServe" className="h-10 w-auto mb-8 mobile-link" />

                    <div className="flex flex-col gap-8 text-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="mobile-link text-4xl font-black italic uppercase tracking-tighter text-white hover:text-violet-500 transition-colors underline-offset-8 hover:underline"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            openEnquiry();
                        }}
                        className="mobile-link mt-8 flex items-center gap-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-95 translate-y-4"
                    >
                        Initiate Connection
                    </button>
                </div>
            </div>

        </>
    );
}

// Internal icons helper
function Send(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    )
}
