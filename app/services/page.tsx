"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { servicesData } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate each service section
            const sections = document.querySelectorAll(".service-section");

            sections.forEach((section, index) => {
                const content = section.querySelector(".service-content");
                const image = section.querySelector(".service-image");
                const features = section.querySelectorAll(".feature-item");
                const benefits = section.querySelectorAll(".benefit-item");

                // Content animation
                gsap.fromTo(
                    content,
                    { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 70%",
                        },
                    }
                );

                // Image animation
                gsap.fromTo(
                    image,
                    { x: index % 2 === 0 ? 100 : -100, opacity: 0, scale: 0.9 },
                    {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 70%",
                        },
                    }
                );

                // Features stagger
                gsap.fromTo(
                    features,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 60%",
                        },
                    }
                );

                // Benefits stagger
                gsap.fromTo(
                    benefits,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 50%",
                        },
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-32 pb-20">
                <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-transparent" />
                <div className="container mx-auto px-4 text-center sm:px-6">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-lime-400">
                        Our Services
                    </span>
                    <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
                        What We <span className="text-lime-400">Do Best</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-neutral-400">
                        Comprehensive digital solutions designed to transform your business and drive sustainable growth.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="h-1 w-24 rounded-full bg-lime-400" />
                    </div>
                </div>
            </section>

            {/* Service Sections */}
            {servicesData.map((service, index) => (
                <section
                    key={service.id}
                    className="service-section relative border-t border-white/5 py-24 lg:py-32"
                >
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${index % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                            {/* Content */}
                            <div className={`service-content ${index % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-6xl font-bold text-lime-400/20 lg:text-8xl">
                                        {service.number}
                                    </span>
                                    <span className="rounded-full bg-lime-400/10 px-4 py-1.5 text-sm font-medium text-lime-400">
                                        {service.tagline}
                                    </span>
                                </div>

                                <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
                                    {service.title}
                                </h2>

                                <p className="mb-8 text-lg text-neutral-400 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <div className="mb-8">
                                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                                        What We Offer
                                    </h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {service.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="feature-item flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                                            >
                                                <svg className="h-5 w-5 flex-shrink-0 text-lime-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm text-neutral-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="mb-8">
                                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                                        Key Benefits
                                    </h3>
                                    <ul className="space-y-2">
                                        {service.benefits.map((benefit) => (
                                            <li
                                                key={benefit}
                                                className="benefit-item flex items-center gap-2 text-neutral-400"
                                            >
                                                <span className="text-lime-400">→</span>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Image */}
                            <div className={`service-image relative ${index % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </div>
                                {/* Decorative element */}
                                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-lime-400/10 blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA Section */}
            <section className="border-t border-white/5 py-24 lg:py-32">
                <div className="container mx-auto px-4 text-center sm:px-6">
                    <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
                        Ready to Get <span className="text-lime-400">Started?</span>
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-400">
                        Let&apos;s discuss how we can help transform your business with our comprehensive digital solutions.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-10 py-4 font-bold text-black transition-all hover:bg-lime-300 hover:scale-105"
                    >
                        Start Your Project
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
