"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        number: "01",
        title: "Digital Branding",
        description:
            "We design digital brand experiences that don’t just look good, they say something. Intentional. Memorable. Human.",
        features: ["Branding", "Social Media Promotion", "SEO/AEO", "Performance Marketing", "Product Photography", "Video Editing", "Logo Design", "Graphic & Motion Design"],
        href: "/services/digital-branding",
    },
    {
        number: "02",
        title: "AI & Automation",
        description:
            "Intelligent automation solutions with Voice Agent AI and WhatsApp chatbots tailored for various industries to scale customer interactions.",
        features: ["Voice Agent AI", "WhatsApp Chatbots", "Lead Qualification", "Customer Support Automation", "Appointment Booking", "Order Tracking"],
        href: "/services/ai-automation",
    },
    {
        number: "03",
        title: "Recruitment",
        description:
            "End-to-end recruitment services that help you find, attract, and hire the best talent for your organization across industries.",
        features: ["Permanent Staffing", "Contract Staffing", "Executive Search", "Bulk Hiring", "HR Consulting"],
        href: "/services/recruitment",
    },
];

export default function Services() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Split text animation for heading
        let headingText: SplitType | null = null;
        if (headingRef.current) {
            headingText = new SplitType(headingRef.current, { types: 'chars' });

            gsap.fromTo(headingText.chars,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.02,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 80%",
                    }
                }
            );
        }

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
            if (headingText) headingText.revert();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} id="services" className="py-32 md:py-48 bg-transparent relative">
            <div className="max-w-[1400px] mx-auto px-5 md:px-20">
                <div className="text-center max-w-[900px] mx-auto mb-20">
                    <span className="inline-block text-sm font-medium tracking-[0.15em] uppercase text-violet-400 mb-6">
                        What We Do
                    </span>
                    <h2 ref={headingRef} className="text-[clamp(2.5rem,6vw,4rem)] font-semibold font-migra leading-[1.1] text-white">
                        Comprehensive Digital Solutions for{" "}
                        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Modern Businesses</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Link
                            key={service.number}
                            href={service.href}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className="service-card group relative glass-card rounded-3xl p-10 transition-all duration-500 hover:bg-violet-500/10 hover:border-violet-500/30 hover:-translate-y-2 block"
                            onMouseEnter={() => setActiveIndex(index)}
                            data-cursor="View"
                        >
                            {/* Top gradient line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Glow effect */}
                            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            <div className="relative z-10">
                                <div className="text-6xl font-bold text-violet-500/20 mb-6 font-migra group-hover:text-violet-500/40 transition-colors duration-500">
                                    {service.number}
                                </div>

                                <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-violet-400 transition-colors duration-300">
                                    {service.title}
                                </h3>

                                <p className="text-base opacity-60 mb-8 leading-relaxed text-white">
                                    {service.description}
                                </p>

                                <ul className="space-y-3">
                                    {service.features.slice(0, 5).map((feature, i) => (
                                        <li
                                            key={feature}
                                            className="text-sm opacity-70 pl-6 relative text-white before:content-['→'] before:absolute before:left-0 before:text-violet-400 before:opacity-0 before:transform before:-translate-x-2 group-hover:before:opacity-100 group-hover:before:translate-x-0 before:transition-all before:duration-300"
                                            style={{ transitionDelay: `${i * 50}ms` }}
                                        >
                                            {feature}
                                        </li>
                                    ))}
                                    {service.features.length > 5 && (
                                        <li className="text-sm text-violet-400 opacity-70">
                                            +{service.features.length - 5} more
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-20">
                    <Link
                        href="/services"
                        data-cursor="View"
                        className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full font-semibold text-lg overflow-hidden relative transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                    >
                        <span className="relative z-10">Explore All Services</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
