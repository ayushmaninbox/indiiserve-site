"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
    {
        question: "What industries do you work with?",
        answer:
            "We work across diverse industries including e-commerce, healthcare, fintech, SaaS, hospitality, and more. Our adaptable approach allows us to bring fresh perspectives and proven strategies to any sector.",
    },
    {
        question: "How do you measure campaign success?",
        answer:
            "We establish clear KPIs at the start of every project, from conversion rates to ROI metrics. Our real-time dashboards provide transparent reporting, and we conduct regular reviews to optimize performance.",
    },
    {
        question: "What is your typical project timeline?",
        answer:
            "Timelines vary based on scope, but most strategy projects take 4-6 weeks, while comprehensive campaigns run 3-6 months. We'll provide a detailed timeline during our initial consultation.",
    },
    {
        question: "Do you offer ongoing support?",
        answer:
            "Absolutely. We offer flexible retainer packages for continuous optimization, monthly reporting, and strategic guidance. Many clients choose ongoing partnerships for sustained growth.",
    },
    {
        question: "How does your pricing work?",
        answer:
            "We offer both project-based and retainer pricing models. After understanding your goals, we provide a detailed proposal with transparent pricing. No hidden fees—just clear value for your investment.",
    },
];

export default function FAQ() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Background stays dark
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => {
                gsap.to("body", {
                    backgroundColor: "#020202",
                    duration: 0.5,
                    ease: "power2.out",
                });
            },
            onLeaveBack: () => {
                gsap.to("body", {
                    backgroundColor: "#020202",
                    duration: 0.5,
                    ease: "power2.out",
                });
            },
        });

        // Staggered items reveal
        gsap.fromTo(
            ".faq-item",
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".faq-list",
                    start: "top 85%",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section ref={sectionRef} id="faq" className="py-32 md:py-48 bg-[#020202] text-white">
            <div className="max-w-[1400px] mx-auto px-5 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24 items-start">
                    <div className="sticky top-32">
                        <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-[#C0FF00] mb-6">
                            FAQs
                        </span>
                        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold font-migra leading-[1.1]">
                            Questions?{" "}
                            <span className="bg-gradient-to-r from-[#8BC34A] to-[#C0FF00] bg-clip-text text-transparent">
                                We&apos;ve got answers
                            </span>
                        </h2>
                    </div>

                    <div className="faq-list space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index
                                        ? "border-[#C0FF00] bg-white/5 shadow-lg"
                                        : "border-white/10 hover:border-[#C0FF00]/50 bg-transparent"
                                    }`}
                            >
                                <button
                                    className="w-full flex justify-between items-center p-6 md:p-8 text-left font-medium text-lg md:text-xl hover:text-[#C0FF00] transition-colors"
                                    onClick={() => toggleFAQ(index)}
                                    data-cursor={openIndex === index ? "Close" : "Open"}
                                >
                                    <span className="pr-8">{faq.question}</span>
                                    <span className="relative w-6 h-6 flex-shrink-0">
                                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-0.5 bg-current transition-transform duration-300" />
                                        <span
                                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-current transition-transform duration-300 ${openIndex === index ? "rotate-90 opacity-0" : ""
                                                }`}
                                        />
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p className="px-6 pb-6 md:px-8 md:pb-8 text-base md:text-lg leading-relaxed opacity-70">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
