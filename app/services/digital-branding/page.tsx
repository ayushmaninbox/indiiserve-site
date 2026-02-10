"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { digitalBrandingServices } from "@/data/digital-branding";

gsap.registerPlugin(ScrollTrigger);

/* ─── SVG Icon Map ─── */
function ServiceIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
    const icons: Record<string, JSX.Element> = {
        branding: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
        ),
        social: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
        ),
        search: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        ),
        chart: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        camera: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
        ),
        video: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
            </svg>
        ),
        catalogue: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        pen: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
        ),
        design: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
            </svg>
        ),
    };

    return icons[name] || icons.branding;
}

export default function DigitalBrandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-content > *",
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }
            );

            gsap.fromTo(
                ".service-card",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".services-grid",
                        start: "top 85%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const toggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#030014] relative z-10">
            {/* Hero */}
            <section className="relative flex min-h-[50vh] items-center justify-center pt-32 pb-12">
                <div className="hero-content container mx-auto px-4 text-center max-w-3xl">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        Digital Branding
                    </span>
                    <h1 className="mb-5 text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                        Build Your Digital Presence
                    </h1>
                    <p className="mx-auto max-w-2xl text-base text-neutral-400 leading-relaxed">
                        From brand strategy to performance marketing — comprehensive solutions that transform your business identity and drive measurable growth.
                    </p>
                </div>
            </section>

            {/* Services Grid — Compact, Expandable */}
            <section className="pb-20">
                <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                    <div className="services-grid space-y-3">
                        {digitalBrandingServices.map((service) => {
                            const isOpen = expandedId === service.id;
                            return (
                                <div
                                    key={service.id}
                                    id={service.id}
                                    className="service-card rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-colors duration-300 hover:border-violet-500/20"
                                >
                                    {/* Collapsed Header — always visible */}
                                    <button
                                        onClick={() => toggle(service.id)}
                                        className="w-full flex items-center gap-4 px-6 py-5 sm:px-8 sm:py-6 text-left group"
                                    >
                                        {/* Icon */}
                                        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${isOpen ? "bg-violet-500/10 border-violet-500/30 text-violet-400" : "bg-white/5 border-white/10 text-neutral-500 group-hover:text-violet-400 group-hover:border-violet-500/20"}`}>
                                            <ServiceIcon name={service.icon} className="w-5 h-5" />
                                        </div>

                                        {/* Title + Tagline */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-base font-semibold transition-colors duration-300 ${isOpen ? "text-white" : "text-neutral-200 group-hover:text-white"}`}>
                                                {service.title}
                                            </h3>
                                            <p className="text-xs text-neutral-500 mt-0.5">{service.tagline}</p>
                                        </div>

                                        {/* Expand Arrow */}
                                        <svg
                                            className={`w-4 h-4 text-neutral-600 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180 text-violet-400" : ""}`}
                                            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Expanded Content */}
                                    {isOpen && (
                                        <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-white/5">
                                            <p className="mt-5 text-sm text-neutral-400 leading-relaxed max-w-2xl">
                                                {service.description}
                                            </p>

                                            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                                {/* Features */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">
                                                        What We Offer
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {service.features.map((f) => (
                                                            <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-300">
                                                                <svg className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Benefits */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">
                                                        Key Results
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {service.benefits.map((b) => (
                                                            <li key={b} className="flex items-center gap-2.5 text-sm text-neutral-300">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                                                {b}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/5 py-20">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                        Ready to Elevate Your Brand?
                    </h2>
                    <p className="mx-auto mb-8 text-neutral-400">
                        Let&apos;s discuss how our digital branding services can drive real results for your business.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-400 active:scale-95"
                    >
                        Get Started
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
