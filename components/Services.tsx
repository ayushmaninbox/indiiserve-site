"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        number: "01",
        title: "Digital Marketing Strategy",
        description:
            "Data-driven marketing strategies that align with your business goals. We analyze, plan, and execute campaigns that deliver measurable results.",
        features: ["Market Research", "Competitive Intelligence", "Campaign Planning", "Performance Optimization"],
    },
    {
        number: "02",
        title: "Content & Social Media",
        description:
            "Engaging content that resonates with your audience. From compelling narratives to viral campaigns that build brand loyalty.",
        features: ["Content Strategy", "Social Media Management", "Influencer Partnerships", "Community Building"],
    },
    {
        number: "03",
        title: "Analytics & Growth",
        description:
            "Turn data into actionable insights. Our analytics solutions help you understand customers and accelerate growth.",
        features: ["Data Analytics", "Conversion Optimization", "A/B Testing", "ROI Tracking"],
    },
];

export default function Services() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Background color transition
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
                    backgroundColor: "#FBFBF4",
                    duration: 0.5,
                    ease: "power2.out",
                });
            },
        });

        // Animate service cards
        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            gsap.fromTo(
                card,
                { opacity: 0, y: 80, rotateX: -10 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 1,
                    delay: i * 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} id="services" className="py-32 md:py-48 bg-[#020202]">
            <div className="max-w-[1400px] mx-auto px-5 md:px-20">
                <div className="text-center max-w-[900px] mx-auto mb-20">
                    <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-[#C0FF00] mb-6">
                        What We Do
                    </span>
                    <h2 className="text-[clamp(2.5rem,6vw,4rem)] font-semibold font-migra leading-[1.1]">
                        Comprehensive Digital Solutions for{" "}
                        <span className="text-[#C0FF00]">Modern Businesses</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={service.number}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className="service-card group relative bg-white/[0.02] border border-white/[0.08] rounded-3xl p-10 transition-all duration-500 hover:bg-white/[0.06] hover:border-[#C0FF00]/30 hover:-translate-y-2"
                            onMouseEnter={() => setActiveIndex(index)}
                            data-cursor="View"
                        >
                            {/* Top gradient line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C0FF00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Glow effect */}
                            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#C0FF00]/0 via-[#C0FF00]/5 to-[#C0FF00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            <div className="relative z-10">
                                <div className="text-6xl font-bold text-[#C0FF00]/10 mb-6 font-migra group-hover:text-[#C0FF00]/20 transition-colors duration-500">
                                    {service.number}
                                </div>

                                <h3 className="text-2xl font-semibold mb-4 group-hover:text-[#C0FF00] transition-colors duration-300">
                                    {service.title}
                                </h3>

                                <p className="text-base opacity-60 mb-8 leading-relaxed">
                                    {service.description}
                                </p>

                                <ul className="space-y-3">
                                    {service.features.map((feature, i) => (
                                        <li
                                            key={feature}
                                            className="text-sm opacity-70 pl-6 relative before:content-['→'] before:absolute before:left-0 before:text-[#C0FF00] before:opacity-0 before:transform before:-translate-x-2 group-hover:before:opacity-100 group-hover:before:translate-x-0 before:transition-all before:duration-300"
                                            style={{ transitionDelay: `${i * 50}ms` }}
                                        >
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-20">
                    <Link
                        href="#contact"
                        data-cursor="View"
                        className="group inline-flex items-center justify-center px-10 py-5 bg-[#C0FF00] text-[#020202] rounded-full font-semibold text-lg overflow-hidden relative transition-transform hover:scale-105"
                    >
                        <span className="relative z-10">Explore All Services</span>
                        <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
