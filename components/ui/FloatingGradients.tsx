"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const gradientOrbs = [
    {
        id: 1,
        color: "bg-blue-800",
        size: "w-[700px] h-[700px]",
        position: "top-[-15%] left-[-10%]",
        blur: "blur-[140px]",
        opacity: "opacity-50",
    },
    {
        id: 2,
        color: "bg-blue-600",
        size: "w-[500px] h-[500px]",
        position: "top-[15%] right-[-10%]",
        blur: "blur-[100px]",
        opacity: "opacity-35",
    },
    {
        id: 3,
        color: "bg-indigo-700",
        size: "w-[600px] h-[600px]",
        position: "top-[40%] left-[5%]",
        blur: "blur-[120px]",
        opacity: "opacity-30",
    },
    {
        id: 4,
        color: "bg-purple-700",
        size: "w-[550px] h-[550px]",
        position: "top-[55%] right-[10%]",
        blur: "blur-[130px]",
        opacity: "opacity-30",
    },
    {
        id: 5,
        color: "bg-violet-600",
        size: "w-[450px] h-[450px]",
        position: "top-[75%] left-[20%]",
        blur: "blur-[100px]",
        opacity: "opacity-35",
    },
    {
        id: 6,
        color: "bg-blue-900",
        size: "w-[600px] h-[600px]",
        position: "top-[85%] right-[0%]",
        blur: "blur-[150px]",
        opacity: "opacity-40",
    },
];

export default function FloatingGradients() {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const orbs = orbsRef.current.filter(Boolean);

        // Scroll-based movement for each orb
        orbs.forEach((orb, index) => {
            if (!orb) return;

            const direction = index % 2 === 0 ? 1 : -1;
            const speed = 0.1 + (index * 0.05);

            gsap.to(orb, {
                y: () => window.innerHeight * speed * direction,
                x: () => 100 * direction * (index % 3 === 0 ? 1 : -1),
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                },
            });

            // Subtle floating animation
            gsap.to(orb, {
                x: `+=${30 * direction}`,
                y: `+=${20 * direction}`,
                duration: 8 + index * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
            aria-hidden="true"
        >
            {gradientOrbs.map((orb, index) => (
                <div
                    key={orb.id}
                    ref={(el) => { orbsRef.current[index] = el; }}
                    className={`absolute rounded-full ${orb.color} ${orb.size} ${orb.position} ${orb.blur} ${orb.opacity} animate-pulse-glow`}
                    style={{
                        animationDelay: `${index * 0.5}s`,
                        animationDuration: `${4 + index}s`,
                    }}
                />
            ))}

            {/* Additional subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/50 to-[#030014]" />
        </div>
    );
}
