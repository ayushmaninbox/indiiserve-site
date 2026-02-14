"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { digitalBrandingServices } from "@/data/digital-branding";

gsap.registerPlugin(ScrollTrigger);

const mainServices = [
    {
        id: "digital-branding",
        number: "01",
        title: "Digital Branding",
        tagline: "Build credibility. Create consistency. Elevate perception.",
        description: "We design digital brand experiences that don’t just look good, they say something. From visuals to voice, every element works together to tell one clear, compelling story across platforms. Intentional. Memorable. Human.",
        href: "/services/digital-branding",
        icon: "✦",
        color: "from-indigo-500/20 to-violet-500/20",
        subServices: ["Branding", "Social Media", "SEO/AEO", "Performance Marketing", "Photography", "Video Editing", "Catalogues", "Logo Design", "Graphic Design"],
    },
    {
        id: "ai-automation",
        number: "02",
        title: "AI & Automation",
        tagline: "Intelligent Solutions at Scale",
        description: "Transform your business operations with cutting-edge AI voice agents and WhatsApp chatbots. Automate conversations and provide 24/7 customer support.",
        href: "/services/ai-automation",
        icon: "🤖",
        color: "from-violet-500/20 to-purple-500/20",
        subServices: ["Voice Agent AI", "WhatsApp Chatbots", "Lead Qualification", "Customer Support", "Appointment Booking", "Order Tracking"],
    },
    {
        id: "recruitment",
        number: "03",
        title: "Recruitment",
        tagline: "Find the Right Talent",
        description: "End-to-end recruitment services that help you find, attract, and hire the best talent for your organization across industries.",
        href: "/services/recruitment",
        icon: "👥",
        color: "from-purple-500/20 to-pink-500/20",
        subServices: ["Permanent Staffing", "Contract Staffing", "Executive Search", "Bulk Hiring", "HR Consulting"],
    },
];

export default function ServicesPage() {
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
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".services-grid",
                        start: "top 80%",
                    },
                }
            );

            gsap.fromTo(
                ".sub-service-card",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".sub-services-section",
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
            <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-32 pb-20">
                <div className="hero-content container mx-auto px-4 text-center sm:px-6">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                        Our Services
                    </span>
                    <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
                        What We <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Do Best</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-neutral-400">
                        Comprehensive solutions designed to transform your business and drive sustainable growth.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    </div>
                </div>
            </section>

            {/* Main Service Categories */}
            <section className="border-t border-violet-500/20 py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white lg:text-4xl mb-4">
                            Our Core Services
                        </h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            Click on any service to explore in detail
                        </p>
                    </div>

                    <div className="services-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {mainServices.map((service) => (
                            <Link
                                key={service.id}
                                href={service.href}
                                className="service-card group relative overflow-hidden rounded-3xl glass-card p-8 transition-all duration-500 hover:bg-violet-500/10 hover:border-violet-500/30 hover:-translate-y-2 block"
                            >
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Top gradient line */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-6xl font-bold text-violet-500/20 group-hover:text-violet-500/40 transition-colors duration-500">
                                            {service.number}
                                        </span>
                                        <span className="text-4xl">{service.icon}</span>
                                    </div>

                                    <span className="inline-block rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 mb-4">
                                        {service.tagline}
                                    </span>

                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    <p className="text-neutral-400 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {service.subServices.slice(0, 4).map((sub) => (
                                            <span
                                                key={sub}
                                                className="text-xs px-3 py-1 rounded-full border border-violet-500/20 text-neutral-500"
                                            >
                                                {sub}
                                            </span>
                                        ))}
                                        {service.subServices.length > 4 && (
                                            <span className="text-xs px-3 py-1 rounded-full border border-violet-500/30 text-violet-400">
                                                +{service.subServices.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-violet-400 font-semibold group-hover:gap-4 transition-all duration-300">
                                        Explore Service
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Digital Branding Sub-Services Preview */}
            <section className="sub-services-section border-t border-violet-500/20 py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                            Digital Branding
                        </span>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl mb-4">
                            All Digital Branding Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {digitalBrandingServices.map((service) => (
                            <Link
                                key={service.id}
                                href={`/services/digital-branding#${service.id}`}
                                className="sub-service-card group flex items-center gap-4 rounded-2xl glass-card p-5 transition-all duration-300 hover:bg-violet-500/10 hover:border-violet-500/30"
                            >
                                <span className="text-3xl">{service.icon}</span>
                                <div>
                                    <h4 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                                        {service.title}
                                    </h4>
                                    <p className="text-sm text-neutral-500">{service.tagline}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            href="/services/digital-branding"
                            className="inline-flex items-center gap-2 text-violet-400 font-semibold hover:gap-4 transition-all duration-300"
                        >
                            View All Digital Branding Services
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 text-center sm:px-6">
                    <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
                        Ready to Get <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Started?</span>
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-400">
                        Let&apos;s discuss how we can help transform your business with our comprehensive digital solutions.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-10 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
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
