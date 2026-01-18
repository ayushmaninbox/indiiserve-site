"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const TRAIL_LENGTH = 8;

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const trailRefs = useRef<HTMLDivElement[]>([]);
    const [cursorText, setCursorText] = useState("");
    const [isHovering, setIsHovering] = useState(false);

    // Trail positions with smooth interpolation
    const trailPositions = useRef<{ x: number; y: number }[]>(
        Array(TRAIL_LENGTH).fill(null).map(() => ({ x: 0, y: 0 }))
    );
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;

        if (!cursor || !cursorDot) return;

        // Mouse move handler
        const onMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.4,
                ease: "power2.out",
            });

            gsap.to(cursorDot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.08,
            });
        };

        // Smooth flowing trail animation
        const updateTrail = () => {
            // First trail follows mouse directly
            trailPositions.current[0].x += (mousePos.current.x - trailPositions.current[0].x) * 0.3;
            trailPositions.current[0].y += (mousePos.current.y - trailPositions.current[0].y) * 0.3;

            // Each subsequent trail follows the one before it (creates flow effect)
            for (let i = 1; i < TRAIL_LENGTH; i++) {
                const prev = trailPositions.current[i - 1];
                const curr = trailPositions.current[i];
                const ease = 0.25 - (i * 0.02); // Decreasing ease for smoother flow
                curr.x += (prev.x - curr.x) * ease;
                curr.y += (prev.y - curr.y) * ease;
            }

            // Update DOM
            trailRefs.current.forEach((trail, i) => {
                if (trail && trailPositions.current[i]) {
                    trail.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`;
                }
            });
        };

        gsap.ticker.add(updateTrail);

        // Hover handlers for interactive elements
        const onMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const cursorLabel = target.dataset.cursor;

            setIsHovering(true);
            setCursorText(cursorLabel ? cursorLabel.toLowerCase() : "");

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

        // Find all interactive elements - use MutationObserver for dynamic elements
        const attachListeners = () => {
            const interactiveElements = document.querySelectorAll(
                'a, button, [data-cursor], .work-card, .service-card'
            );

            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnter as EventListener);
                el.removeEventListener("mouseleave", onMouseLeave);
                el.addEventListener("mouseenter", onMouseEnter as EventListener);
                el.addEventListener("mouseleave", onMouseLeave);
            });
        };

        attachListeners();

        // Re-attach on DOM changes
        const observer = new MutationObserver(attachListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            gsap.ticker.remove(updateTrail);
            observer.disconnect();
        };
    }, []);

    // Hide cursor on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
        return null;
    }

    // Trail colors - flowing gradient of neon green
    const trailColors = [
        { color: "rgba(192, 255, 0, 0.6)", size: 8, glow: 12 },
        { color: "rgba(180, 245, 20, 0.5)", size: 7, glow: 10 },
        { color: "rgba(165, 230, 40, 0.4)", size: 6, glow: 8 },
        { color: "rgba(150, 215, 60, 0.35)", size: 5, glow: 7 },
        { color: "rgba(135, 200, 80, 0.3)", size: 5, glow: 6 },
        { color: "rgba(120, 185, 90, 0.25)", size: 4, glow: 5 },
        { color: "rgba(105, 170, 100, 0.2)", size: 4, glow: 4 },
        { color: "rgba(90, 155, 110, 0.15)", size: 3, glow: 3 },
    ];

    return (
        <>
            {/* Trail particles - render in reverse so first (closest) is on top */}
            {trailColors.map((config, i) => (
                <div
                    key={i}
                    ref={(ref) => { if (ref) trailRefs.current[i] = ref; }}
                    className="fixed top-0 left-0 pointer-events-none z-[9996] rounded-full"
                    style={{
                        width: `${config.size}px`,
                        height: `${config.size}px`,
                        marginLeft: `${-config.size / 2}px`,
                        marginTop: `${-config.size / 2}px`,
                        backgroundColor: config.color,
                        boxShadow: `0 0 ${config.glow}px ${config.color}`,
                        willChange: 'transform',
                    }}
                />
            ))}

            {/* Main cursor with glow */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-12 h-12 -ml-6 -mt-6 pointer-events-none z-[9998] rounded-full border-2 transition-colors duration-300 flex items-center justify-center ${isHovering
                    ? "border-[#C0FF00] bg-[#C0FF00]/20"
                    : "border-[#C0FF00]/50 bg-transparent"
                    }`}
                style={{
                    mixBlendMode: cursorText ? "normal" : "difference",
                    boxShadow: isHovering
                        ? "0 0 20px rgba(192, 255, 0, 0.6), 0 0 40px rgba(192, 255, 0, 0.3)"
                        : "0 0 10px rgba(192, 255, 0, 0.3)",
                }}
            >
                {cursorText && (
                    <span className="text-[8px] font-medium lowercase tracking-wider text-[#C0FF00]">
                        {cursorText}
                    </span>
                )}
            </div>

            {/* Cursor dot with glow */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 pointer-events-none z-[9999] rounded-full bg-[#C0FF00]"
                style={{
                    boxShadow: "0 0 8px rgba(192, 255, 0, 0.8), 0 0 16px rgba(192, 255, 0, 0.5)",
                }}
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
