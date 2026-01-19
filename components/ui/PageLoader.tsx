"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLoader } from "@/context/LoaderContext";

const shapes = [
    "/images/circle.png",
    "/images/multistar.png",
    "/images/half tri.png"
];

export default function PageLoader() {
    const { setIsLoading } = useLoader();
    const [isComplete, setIsComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLSpanElement>(null);
    const shapesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => setIsComplete(true),
            });

            // Initial State
            gsap.set(shapesRef.current, {
                opacity: 0,
                scale: 0,
            });

            // 1. Animate shapes in
            tl.to(shapesRef.current, {
                opacity: 0.6,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)",
            });

            // 2. Continuous rotation for shapes (loop)
            shapesRef.current.forEach((shape, i) => {
                gsap.to(shape, {
                    rotation: i % 2 === 0 ? 360 : -360,
                    duration: 10 + i * 2,
                    repeat: -1,
                    ease: "none",
                });

                // Float effect
                gsap.to(shape, {
                    y: 20,
                    duration: 2 + i,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                });
            });

            // 3. Progress Bar & Counter Animation
            const progressObj = { value: 0 };

            tl.to(progressObj, {
                value: 100,
                duration: 2.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    if (progressRef.current) {
                        progressRef.current.style.width = `${progressObj.value}%`;
                    }
                    if (numberRef.current) {
                        numberRef.current.textContent = Math.round(progressObj.value).toString();
                    }
                },
            }, "-=0.5");

            // 4. Exit Sequence
            if (progressRef.current) {
                tl.to([numberRef.current, ".loading-text", progressRef.current.parentElement], {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    ease: "power2.in"
                });
            }

            tl.to(shapesRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "back.in(1.7)"
            }, "<");

            // Curtain Reveal
            // Trigger main site load JUST before curtain goes up
            tl.call(() => setIsLoading(false));

            tl.to(containerRef.current, {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut",
            });
        }, containerRef);

        return () => ctx.revert();
    }, [setIsLoading]);

    if (isComplete) return null;

    return (
        <div
            ref={containerRef}
            className="loader-overlay fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Floating Background Shapes */}
            <div className="absolute inset-0 pointer-events-none">
                {shapes.map((src, i) => (
                    <div
                        key={i}
                        ref={el => { if (el) shapesRef.current[i] = el }}
                        className={`absolute w-16 h-16 md:w-24 md:h-24 opacity-0
                            ${i === 0 ? "top-[20%] left-[20%]" : ""}
                            ${i === 1 ? "bottom-[30%] right-[15%]" : ""}
                            ${i === 2 ? "top-[60%] left-[10%]" : ""}
                        `}
                    >
                        <Image
                            src={src}
                            alt="shape"
                            width={100}
                            height={100}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
                {/* Large Counter */}
                <div className="relative mb-2">
                    <span
                        ref={numberRef}
                        className="text-[8rem] md:text-[12rem] font-bold text-[#C0FF00] font-migra leading-none"
                    >
                        0
                    </span>
                    <span className="text-2xl md:text-4xl text-white/50 font-migra absolute top-8 -right-8">%</span>
                </div>

                {/* Loading Bar Container */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-8 mb-4">
                    <div
                        ref={progressRef}
                        className="h-full bg-[#C0FF00] shadow-[0_0_20px_rgba(192,255,0,0.5)] w-0"
                    />
                </div>

                {/* Text */}
                <div className="loading-text flex justify-between w-full text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                    <span>Loading Experience</span>
                    <span>InDiiServe ©2026</span>
                </div>
            </div>
        </div>
    );
}
