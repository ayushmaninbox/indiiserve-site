"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { digitalBrandingServices } from "@/data/digital-branding";

gsap.registerPlugin(ScrollTrigger);

export default function DigitalBrandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-content > *",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );

            gsap.fromTo(
                ".service-card",
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".services-grid",
                        start: "top 80%",
                    },
                }
            );

            const sections = document.querySelectorAll(".service-section");
            sections.forEach((section) => {
                const content = section.querySelector(".section-content");
                const features = section.querySelectorAll(".feature-item");

                gsap.fromTo(
                    content,
                    { x: -60, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 70%",
                        },
                    }
                );

                gsap.fromTo(
                    features,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.08,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 60%",
                        },
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-32 pb-20">
                <div className="hero-content container mx-auto px-4 text-center sm:px-6">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                        Digital Branding Services
                    </span>
                    <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
                        Build Your <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Digital Presence</span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-neutral-400 leading-relaxed">
                        Comprehensive digital branding solutions that transform your business identity.
                        From stunning visuals to strategic marketing, we help you stand out in the digital landscape.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    </div>
                </div>
            </section>

            {/* Quick Links Grid */}
            <section className="border-t border-violet-500/20 py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="mb-12 text-center text-2xl font-bold text-white">
                        Our Services
                    </h2>
                    <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {digitalBrandingServices.map((service) => (
                            <a
                                key={service.id}
                                href={`#${service.id}`}
                                className="service-card group relative overflow-hidden rounded-2xl glass-card p-6 transition-all duration-500 hover:bg-violet-500/10 hover:border-violet-500/30"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{service.icon}</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500">{service.tagline}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Individual Service Sections */}
            {digitalBrandingServices.map((service, index) => (
                <section
                    key={service.id}
                    id={service.id}
                    className="service-section border-t border-violet-500/20 py-24 lg:py-32"
                >
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="section-content max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-5xl">{service.icon}</span>
                                <span className="rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
                                    {service.tagline}
                                </span>
                            </div>

                            <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
                                {service.title}
                            </h2>

                            <p className="mb-10 text-lg text-neutral-400 leading-relaxed">
                                {service.description}
                            </p>

                            {/* Features */}
                            <div className="mb-10">
                                <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                                    What We Offer
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {service.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="feature-item flex items-center gap-3 rounded-xl glass-card px-4 py-4"
                                        >
                                            <svg className="h-5 w-5 flex-shrink-0 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm text-neutral-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="mb-10">
                                <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                                    Key Benefits
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {service.benefits.map((benefit) => (
                                        <div
                                            key={benefit}
                                            className="feature-item flex items-center gap-3"
                                        >
                                            <span className="text-violet-400 text-lg">→</span>
                                            <span className="text-neutral-300">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA Section */}
            <section className="border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 text-center sm:px-6">
                    <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
                        Ready to Transform Your <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Brand?</span>
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-400">
                        Let&apos;s discuss how our digital branding services can elevate your business to new heights.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-10 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                        Get Started
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
