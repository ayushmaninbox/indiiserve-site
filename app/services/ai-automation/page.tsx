"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    voiceAgentUseCases,
    whatsappChatbotUseCases,
    aiAutomationData,
} from "@/data/ai-automation";

gsap.registerPlugin(ScrollTrigger);

export default function AIAutomationPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<"voice" | "whatsapp">("voice");

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-content > *",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );

            gsap.fromTo(
                ".tab-content",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".tab-section",
                        start: "top 80%",
                    },
                }
            );

            gsap.fromTo(
                ".industry-card",
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".industries-grid",
                        start: "top 80%",
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const currentData = activeSection === "voice"
        ? aiAutomationData.voiceAgent
        : aiAutomationData.whatsappChatbot;
    const currentUseCases = activeSection === "voice"
        ? voiceAgentUseCases
        : whatsappChatbotUseCases;

    return (
        <main ref={containerRef} className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-32 pb-20">
                <div className="hero-content container mx-auto px-4 text-center sm:px-6">
                    <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                        AI & Automation
                    </span>
                    <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
                        Intelligent <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Automation</span> Solutions
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-neutral-400 leading-relaxed">
                        Transform your business operations with cutting-edge AI voice agents and WhatsApp chatbots.
                        Automate conversations, qualify leads, and provide 24/7 customer support.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="tab-section border-t border-violet-500/20 py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    {/* Service Toggle */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex rounded-full glass-card p-1">
                            <button
                                onClick={() => setActiveSection("voice")}
                                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${activeSection === "voice"
                                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                                    : "text-neutral-400 hover:text-white"
                                    }`}
                            >
                                🎙️ Voice Agent AI
                            </button>
                            <button
                                onClick={() => setActiveSection("whatsapp")}
                                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${activeSection === "whatsapp"
                                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                                    : "text-neutral-400 hover:text-white"
                                    }`}
                            >
                                💬 WhatsApp Chatbots
                            </button>
                        </div>
                    </div>

                    {/* Active Service Details */}
                    <div className="tab-content max-w-4xl mx-auto mb-16">
                        <div className="text-center">
                            <span className="rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
                                {currentData.tagline}
                            </span>
                            <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
                                {currentData.title}
                            </h2>
                            <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
                                {currentData.description}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {currentData.features.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 rounded-xl glass-card px-4 py-4"
                                >
                                    <svg className="h-5 w-5 flex-shrink-0 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm text-neutral-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Use Cases */}
            <section className="border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                            Industry Applications
                        </span>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">
                            Use Cases by Industry
                        </h2>
                        <p className="mt-4 mx-auto max-w-2xl text-neutral-400">
                            See how {activeSection === "voice" ? "Voice Agent AI" : "WhatsApp Chatbots"} can transform operations across different industries.
                        </p>
                    </div>

                    <div className="industries-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentUseCases.map((industry) => (
                            <div
                                key={industry.id}
                                className="industry-card group relative overflow-hidden rounded-2xl glass-card p-8 transition-all duration-500 hover:bg-violet-500/10 hover:border-violet-500/30"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-4xl">{industry.icon}</span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                                        {industry.industry}
                                    </h3>
                                </div>

                                <ul className="space-y-4">
                                    {industry.useCases.map((useCase, idx) => (
                                        <li key={idx} className="border-l-2 border-violet-500/30 pl-4">
                                            <h4 className="text-sm font-semibold text-white mb-1">
                                                {useCase.title}
                                            </h4>
                                            <p className="text-sm text-neutral-500 leading-relaxed">
                                                {useCase.description}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="border-t border-violet-500/20 py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                            Implementation
                        </span>
                        <h2 className="text-3xl font-bold text-white lg:text-4xl">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            { step: "01", title: "Discovery", desc: "We analyze your business needs and identify automation opportunities." },
                            { step: "02", title: "Design", desc: "Create conversation flows and integrate with your existing systems." },
                            { step: "03", title: "Deploy", desc: "Launch your AI solution with thorough testing and training." },
                            { step: "04", title: "Optimize", desc: "Continuous improvement based on real conversation data." },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
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
                        Ready to <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Automate?</span>
                    </h2>
                    <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-400">
                        Let&apos;s discuss how AI automation can transform your customer interactions and scale your operations.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-10 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                        Schedule a Demo
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
