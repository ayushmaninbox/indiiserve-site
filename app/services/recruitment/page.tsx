"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { recruitmentData } from "@/lib/serviceData";

gsap.registerPlugin(ScrollTrigger);

export default function RecruitmentPage() {
    const containerRef = useRef<HTMLDivElement>(null);

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
            <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-32 pb-20">
                <div className="hero-content container mx-auto px-4 text-center sm:px-6">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                        {recruitmentData.tagline}
                    </span>
                    <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
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
            <section className="border-t border-violet-500/20 py-16">
                <div className="container mx-auto px-4 sm:px-6">
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
            <section className="services-section border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                            Our Services
                        </span>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">
                            Comprehensive Staffing Solutions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {recruitmentData.services.map((service, index) => (
                            <div
                                key={service.id}
                                className="service-card group relative overflow-hidden rounded-2xl glass-card p-8 transition-all duration-500 hover:bg-violet-500/10 hover:border-violet-500/30"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-5xl font-bold text-violet-500/20">
                                        0{index + 1}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">
                                        {service.title}
                                    </h3>
                                </div>

                                <p className="text-neutral-400 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {service.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-center gap-2 text-sm text-neutral-500"
                                        >
                                            <span className="text-violet-400">→</span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
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
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-10 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                        Start Hiring
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
