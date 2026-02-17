"use client";

import { useEffect, useRef, useState } from "react";
import { useEnquiry } from "@/context/EnquiryContext";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { recruitmentData } from "@/lib/serviceData";

gsap.registerPlugin(ScrollTrigger);

export default function RecruitmentPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
    const { openEnquiry } = useEnquiry();

    const toggleService = (id: string) => {
        setExpandedServiceId(expandedServiceId === id ? null : id);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-content > *",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );

            gsap.fromTo(
                ".stat-item",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".stats-grid",
                        start: "top 80%",
                    },
                }
            );

            gsap.fromTo(
                ".service-card",
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".services-section",
                        start: "top 80%",
                    },
                }
            );

            gsap.fromTo(
                ".industry-tag",
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".industries-section",
                        start: "top 80%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative flex min-h-[40vh] md:min-h-[70vh] items-center justify-center overflow-hidden pt-24 md:pt-32 pb-12 md:pb-20">
                <div className="hero-content container mx-auto px-4 text-center sm:px-6">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                        {recruitmentData.tagline}
                    </span>
                    <h1 className="mb-6 text-[clamp(2rem,8vw,4.5rem)] font-bold text-white sm:text-5xl lg:text-7xl">
                        {recruitmentData.title.split(" ")[0]}{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">{recruitmentData.title.split(" ").slice(1).join(" ")}</span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-neutral-400 leading-relaxed">
                        {recruitmentData.description}
                    </p>

                    {/* Main Features */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        {recruitmentData.mainFeatures.map((feature) => (
                            <span
                                key={feature}
                                className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-400"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-t border-violet-500/20 py-12 md:py-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8">
                        {recruitmentData.stats.map((stat) => (
                            <div key={stat.label} className="stat-item text-center">
                                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-neutral-500 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section border-t border-violet-500/20 py-16 md:py-24 lg:py-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                            Our Services
                        </span>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">
                            Comprehensive Staffing Solutions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-start gap-8">
                        {recruitmentData.services.map((service, index) => {
                            const isOpen = expandedServiceId === service.id;
                            return (
                                <div
                                    key={service.id}
                                    className={`service-card group relative overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen 
                                        ? "border-violet-500/50 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.15)]" 
                                        : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20"
                                    }`}
                                >
                                    <button 
                                        onClick={() => toggleService(service.id)}
                                        className="w-full flex items-center justify-between p-8 text-left group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className={`text-5xl font-bold transition-opacity duration-300 ${isOpen ? "text-violet-500/40" : "text-violet-500/10"}`}>
                                                0{index + 1}
                                            </span>
                                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${isOpen ? "text-violet-400" : "text-white group-hover:text-violet-400"}`}>
                                                {service.title}
                                            </h3>
                                        </div>

                                        {/* FAQ-style Plus/Minus Icon */}
                                        <div className="relative w-5 h-5 flex-shrink-0">
                                            <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1.5px] bg-current transition-transform duration-300 ${isOpen ? "text-violet-400" : "text-neutral-600"}`} />
                                            <span
                                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-4 bg-current transition-transform duration-300 ${isOpen ? "rotate-90 opacity-0 text-violet-400" : "text-neutral-600"
                                                    }`}
                                            />
                                        </div>
                                    </button>

                                    {/* Expanded Content — FAQ-style Animation */}
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                        <div className="px-8 pb-8 border-t border-white/5 pt-6">
                                            <p className="text-neutral-400 mb-8 leading-relaxed max-w-3xl">
                                                {service.description}
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {service.features.map((feature) => (
                                                    <div
                                                        key={feature}
                                                        className="flex items-center gap-3 text-sm text-neutral-300 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                                                    >
                                                        <span className="text-violet-400 font-bold shrink-0">→</span>
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Industries Section */}
            <section className="industries-section border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                            Industries We Serve
                        </span>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">
                            Expertise Across Sectors
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {recruitmentData.industries.map((industry) => (
                            <span
                                key={industry}
                                className="industry-tag inline-block rounded-full glass-card px-6 py-3 text-neutral-300 hover:border-violet-500/30 hover:text-violet-400 transition-all cursor-default"
                            >
                                {industry}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                            Our Process
                        </span>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">
                            How We Work
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
                        {[
                            { step: "01", title: "Requirement Analysis", desc: "Understand your hiring needs and culture" },
                            { step: "02", title: "Sourcing", desc: "Tap into our talent pool and networks" },
                            { step: "03", title: "Screening", desc: "Rigorous assessment and shortlisting" },
                            { step: "04", title: "Interviews", desc: "Coordinate and manage interview process" },
                            { step: "05", title: "Onboarding", desc: "Support smooth candidate integration" },
                        ].map((item, idx) => (
                            <div key={item.step} className="relative text-center">
                                {idx < 4 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
                                )}
                                <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 relative z-10">
                                    <span className="text-violet-400 font-bold text-lg">{item.step}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-neutral-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 text-center sm:px-6">
                    <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
                        Ready to Build Your <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Dream Team?</span>
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-400">
                        Partner with us to find the right talent that drives your business forward.
                    </p>
                    <button
                        onClick={openEnquiry}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-10 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                        Start Hiring
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </section>
        </main>
    );
}
