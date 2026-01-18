"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function PageLoader() {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Animate progress from 0 to 100
        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
            setProgress(newProgress);

            if (newProgress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                // Start exit animation
                setTimeout(() => {
                    gsap.to(".loader-overlay", {
                        yPercent: -100,
                        duration: 0.8,
                        ease: "power3.inOut",
                        onComplete: () => setIsComplete(true),
                    });
                }, 300);
            }
        };

        requestAnimationFrame(updateProgress);

        // Prevent scroll during loading
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    if (isComplete) return null;

    return (
        <div className="loader-overlay fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center">
            <div className="relative">
                {/* Logo */}
                <h1 className="text-4xl md:text-6xl font-bold text-[#C0FF00] font-migra mb-8">
                    InDiiServe
                </h1>

                {/* Progress bar */}
                <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#C0FF00] transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Progress number */}
                <div className="mt-4 text-center">
                    <span className="text-5xl font-bold text-white/90 font-migra">
                        {progress}
                    </span>
                    <span className="text-xl text-white/50">%</span>
                </div>
            </div>

            {/* Loading text */}
            <p className="absolute bottom-10 text-sm text-white/40 tracking-widest uppercase">
                Loading Experience
            </p>
        </div>
    );
}
