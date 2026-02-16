"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Mail, Phone, Instagram, Linkedin, Facebook } from "lucide-react";
import { About } from "@/components/sections";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const headerRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hero animation
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );


    }, []);

    return (
        <main className="bg-[#030014] text-white pt-32 min-h-screen">
            {/* Simple Hero Section */}
            <div ref={headerRef} className="max-w-[1400px] mx-auto px-5 md:px-20 mb-20 text-center">
                <span className="inline-block text-sm font-medium tracking-[0.25em] uppercase text-violet-400 mb-6">
                    InDiiServe Stories
                </span>
                <h1 className="text-[clamp(2.5rem,10vw,7rem)] font-bold font-migra leading-[0.95] mb-8">
                    Crafting Narratives <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent italic">
                        That Resonate.
                    </span>
                </h1>
                <p className="text-lg md:text-2xl opacity-70 max-w-[800px] mx-auto leading-relaxed">
                    We don&apos;t just build brands; we build legacies. Every business has a story, and we make sure yours is the one people remember.
                </p>
            </div>

            {/* Reuse the Story Philosophy Section */}
            <About />

            {/* Comprehensive Contact Section */}
            <div ref={contactRef} className="py-20 md:py-48 bg-gradient-to-b from-transparent to-violet-950/20 relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-5 md:px-20 relative z-10">
                    <div className="max-w-[800px] mx-auto">
                        <div>
                            <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-violet-400 mb-6">
                                Get In Touch
                            </span>
                            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold font-migra mb-10 leading-[1.1]">
                                Ready to start <br />
                                <span className="text-violet-400">your next chapter?</span>
                            </h2>
                            <p className="text-xl opacity-70 mb-12 max-w-[500px]">
                                Whether you have a project in mind or just want to say hello, we&apos;re all ears. Let&apos;s build something extraordinary together.
                            </p>

                            <div className="space-y-6">
                                <a href="mailto:info@indiiserve.com" className="flex items-center gap-4 group/link text-xl hover:text-violet-400 transition-colors">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-violet-500/50 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    info@indiiserve.com
                                </a>
                                <a href="tel:+919874709182" className="flex items-center gap-4 group/link text-xl hover:text-violet-400 transition-colors">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-violet-500/50 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    +91 98747 09182
                                </a>
                            </div>

                            <div className="flex gap-6 mt-12">
                                {[
                                    { icon: <Linkedin />, href: "https://www.linkedin.com/company/indiiserve-solutions/" },
                                    { icon: <Instagram />, href: "https://www.instagram.com/indiiservedigital/" },
                                    { icon: <Facebook />, href: "https://www.facebook.com/IndiiserveDigitalSolutions" },
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-violet-500/20 hover:border-violet-500/30 transition-all text-white hover:text-violet-400"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </main>
    );
}
