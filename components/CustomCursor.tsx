"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const [cursorText, setCursorText] = useState("");
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;

        if (!cursor || !cursorDot) return;

        // Mouse move handler
        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power2.out",
            });

            gsap.to(cursorDot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
            });
        };

        // Hover handlers for interactive elements
        const onMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const cursorLabel = target.dataset.cursor;

            setIsHovering(true);
            setCursorText(cursorLabel || "");

            gsap.to(cursor, {
                scale: cursorLabel ? 3 : 1.5,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const onMouseLeave = () => {
            setIsHovering(false);
            setCursorText("");

            gsap.to(cursor, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        // Add event listeners
        window.addEventListener("mousemove", onMouseMove);

        // Find all interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [data-cursor], .work-card, .service-card'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", onMouseEnter as EventListener);
            el.addEventListener("mouseleave", onMouseLeave);
        });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnter as EventListener);
                el.removeEventListener("mouseleave", onMouseLeave);
            });
        };
    }, []);

    // Hide cursor on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
        return null;
    }

    return (
        <>
            {/* Main cursor */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 pointer-events-none z-[9998] rounded-full border transition-colors duration-300 flex items-center justify-center ${isHovering
                        ? "border-[#C0FF00] bg-[#C0FF00]/10"
                        : "border-white/30 bg-transparent"
                    }`}
                style={{ mixBlendMode: cursorText ? "normal" : "difference" }}
            >
                {cursorText && (
                    <span className="text-[8px] font-medium uppercase tracking-wider text-[#C0FF00]">
                        {cursorText}
                    </span>
                )}
            </div>

            {/* Cursor dot */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-1 h-1 -ml-0.5 -mt-0.5 pointer-events-none z-[9999] rounded-full bg-[#C0FF00]"
            />

            {/* Hide default cursor */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (hover: none) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
        </>
    );
}
