"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            gsap.to(".mobile-menu", {
                opacity: 1,
                y: 0,
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
                y: -10,
                pointerEvents: "none",
                duration: 0.4,
                ease: "power3.in",
            });
        }
    }, [isOpen]);

    const navLinks = [
        { href: "#services", label: "Services" },
        { href: "#work", label: "Work" },
        { href: "#about", label: "About" },
        { href: "#faq", label: "FAQ" },
    ];

    return (
        <>
            <nav
                className={`fixed top-8 left-1/2 -translate-x-1/2 z-[5000] transition-all duration-500 ease-out ${scrolled ? "mobile:w-[90%] md:w-auto" : "w-[95%] md:w-auto"
                    }`}
            >
                <div
                    className={`flex items-center gap-2 md:gap-10 bg-[#020202]/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl transition-all duration-500 ${scrolled ? "bg-[#020202]/95 border-white/5" : ""
                        }`}
                >
                    <Link
                        href="/"
                        className="font-migra text-xl font-bold text-[#C0FF00] mr-4"
                        data-cursor="Home"
                    >
                        InDiiServe
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-white/80 hover:text-[#C0FF00] transition-colors relative group"
                                data-cursor="Link"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-full h-px bg-[#C0FF00] scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-300" />
                            </Link>
                        ))}
                    </div>

                    <Link
                        href="#contact"
                        className="hidden md:inline-flex items-center justify-center bg-[#C0FF00] text-[#020202] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white transition-colors duration-300"
                        data-cursor="Start"
                    >
                        Get Started
                    </Link>

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
                    <Link
                        href="#contact"
                        className="mobile-link text-3xl font-migra font-bold text-[#C0FF00]"
                        onClick={() => setIsOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </>
    );
}
