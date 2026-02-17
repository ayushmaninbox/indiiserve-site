"use client";

import { useEffect, useRef, useState } from "react";
import { useEnquiry } from "@/context/EnquiryContext";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { voiceAgentUseCases, whatsappChatbotUseCases, aiAutomationData } from "@/lib/serviceData";

gsap.registerPlugin(ScrollTrigger);

/* ─── SVG Icon Map ─── */
function IndustryIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
    const icons: Record<string, React.ReactElement> = {
        healthcare: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        finance: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
        cart: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
        ),
        building: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
            </svg>
        ),
        hotel: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
        ),
        chat: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
        ),
        target: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        ),
        package: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
        ),
        calendar: (
            <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
    };

    return icons[name] || icons.chat;
}

export default function AIAutomationPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<"voice" | "whatsapp">("voice");
    const { openEnquiry } = useEnquiry();
    const [expandedIndustryId, setExpandedIndustryId] = useState<string | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".hero-content > *",
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }
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

    const toggleIndustry = (id: string) => {
        setExpandedIndustryId(expandedIndustryId === id ? null : id);
    };

    const currentData = activeSection === "voice"
        ? aiAutomationData.voiceAgent
        : aiAutomationData.whatsappChatbot;
    const currentUseCases = activeSection === "voice"
        ? voiceAgentUseCases
        : whatsappChatbotUseCases;

    return (
        <main ref={containerRef} className="min-h-screen bg-[#030014] relative z-10">
            {/* Hero */}
            <section className="relative flex min-h-[40vh] md:min-h-[50vh] items-center justify-center pt-24 md:pt-32 pb-10 md:pb-12">
                <div className="hero-content container mx-auto px-4 text-center max-w-3xl">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                        AI & Automation
                    </span>
                    <h1 className="mb-5 text-[clamp(2rem,8vw,3.75rem)] font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                        Intelligent Automation Solutions
                    </h1>
                    <p className="mx-auto max-w-2xl text-base text-neutral-400 leading-relaxed">
                        Transform your business operations with AI voice agents and WhatsApp chatbots.
                        Automate conversations, qualify leads, and provide 24/7 customer support.
                    </p>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="tab-section border-t border-white/5 py-12 md:py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    {/* Toggle */}
                    <div className="flex justify-center mb-12">
                        <div className="relative inline-flex rounded-full border border-white/10 bg-white/[0.02] p-1.5 backdrop-blur-sm">
                            {/* Liquid Glass Pill */}
                            <div
                                className="absolute top-1.5 bottom-1.5 left-1.5 transition-all duration-500 ease-[cubic-bezier(0.32,0,0.07,1)] bg-violet-500 shadow-[0_4px_15px_rgba(139,92,246,0.4)] rounded-full z-0"
                                style={{
                                    width: "calc(50% - 6px)",
                                    transform: activeSection === "voice" ? "translateX(0) scaleX(1)" : "translateX(calc(100% + 6px)) scaleX(1)",
                                }}
                            />
                            
                            <button
                                onClick={() => setActiveSection("voice")}
                                className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${activeSection === "voice"
                                    ? "text-white"
                                    : "text-neutral-400 hover:text-neutral-200"
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                </svg>
                                Voice Agent AI
                            </button>
                            <button
                                onClick={() => setActiveSection("whatsapp")}
                                className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${activeSection === "whatsapp"
                                    ? "text-white"
                                    : "text-neutral-400 hover:text-neutral-200"
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                                WhatsApp Chatbots
                            </button>
                        </div>
                    </div>

                    {/* Active Service Details */}
                    <div className="tab-content max-w-3xl mx-auto mb-16">
                        <div className="text-center">
                            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-xs font-semibold text-violet-400">
                                {currentData.tagline}
                            </span>
                            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                                {currentData.title}
                            </h2>
                            <p className="mt-4 text-neutral-400 leading-relaxed">
                                {currentData.description}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {currentData.features.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                                >
                                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span className="text-sm text-neutral-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Use Cases */}
            <section className="border-t border-white/5 py-16 md:py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                            Industry Applications
                        </span>
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">
                            Use Cases by Industry
                        </h2>
                        <p className="mt-3 mx-auto max-w-xl text-neutral-500 text-sm">
                            See how {activeSection === "voice" ? "Voice Agent AI" : "WhatsApp Chatbots"} can transform operations across different industries.
                        </p>
                    </div>

                    <div className="industries-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-start gap-4">
                        {currentUseCases.map((industry) => {
                            const isOpen = expandedIndustryId === industry.id;
                            return (
                                <div
                                    key={industry.id}
                                    className={`industry-card rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen 
                                        ? "border-violet-500/50 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.15)]" 
                                        : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20"
                                    }`}
                                >
                                    <button 
                                        onClick={() => toggleIndustry(industry.id)}
                                        className="w-full flex items-center justify-between p-6 text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-300 ${isOpen ? "bg-violet-500/10 border-violet-500/30 text-violet-400" : "bg-white/5 border-white/10 text-neutral-500 group-hover:text-violet-400 group-hover:border-violet-500/20"}`}>
                                                <IndustryIcon name={industry.icon} className="w-5 h-5" />
                                            </div>
                                            <h3 className={`text-base font-semibold transition-colors duration-300 ${isOpen ? "text-white" : "text-neutral-200 group-hover:text-white"}`}>
                                                {industry.industry}
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
                                        <div className="px-6 pb-6 border-t border-white/5">
                                            <ul className="space-y-4 pt-6">
                                                {industry.useCases.map((useCase, idx) => (
                                                    <li key={idx} className="border-l-2 border-violet-500/20 pl-4">
                                                        <h4 className="text-sm font-semibold text-neutral-200 mb-1">
                                                            {useCase.title}
                                                        </h4>
                                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                                            {useCase.description}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="border-t border-white/5 py-20">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                            Implementation
                        </span>
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "Discovery", desc: "We analyze your business needs and identify automation opportunities.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
                            { step: "02", title: "Design", desc: "Create conversation flows and integrate with your existing systems.", icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" },
                            { step: "03", title: "Deploy", desc: "Launch your AI solution with thorough testing and training.", icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" },
                            { step: "04", title: "Optimize", desc: "Continuous improvement based on real conversation data.", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">{item.step}</span>
                                <h3 className="text-sm font-semibold text-white mt-1 mb-1">{item.title}</h3>
                                <p className="text-xs text-neutral-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/5 py-20">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                        Ready to Automate?
                    </h2>
                    <p className="mx-auto mb-8 text-neutral-400">
                        Let&apos;s discuss how AI automation can transform your customer interactions and scale your operations.
                    </p>
                    <button
                        onClick={openEnquiry}
                        className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-400 active:scale-95"
                    >
                        Schedule a Demo
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </section>
        </main>
    );
}
