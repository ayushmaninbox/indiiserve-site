"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
    as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({
    children,
    className = "",
    delay = 0,
    as: Component = "span",
}: TextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        gsap.set(textRef.current, { yPercent: 100 });

        gsap.to(textRef.current, {
            yPercent: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [delay]);

    return (
        <div ref={containerRef} className="overflow-hidden">
            <Component ref={textRef as React.Ref<never>} className={`block ${className}`}>
                {children}
            </Component>
        </div>
    );
}
