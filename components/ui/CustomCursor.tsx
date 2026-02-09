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
            if (document.body.classList.contains('hide-cursor-trail')) {
                trailRefs.current.forEach(trail => {
                    if (trail) trail.style.display = 'none';
                });
                return;
            }

            trailRefs.current.forEach(trail => {
                if (trail) trail.style.display = 'block';
            });

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
                'a:not(.no-cursor), button:not(.no-cursor), [data-cursor], .work-card, .service-card'
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

    // Trail colors - flowing gradient from blue to violet
    const trailColors = [
        { color: "rgba(59, 130, 246, 0.6)", size: 8, glow: 12 },   // blue-500
        { color: "rgba(79, 112, 229, 0.5)", size: 7, glow: 10 },   // blue-indigo
        { color: "rgba(99, 102, 241, 0.45)", size: 6, glow: 8 },   // indigo-500
        { color: "rgba(109, 95, 230, 0.4)", size: 5, glow: 7 },    // indigo-violet
        { color: "rgba(124, 88, 236, 0.35)", size: 5, glow: 6 },   // indigo-violet
        { color: "rgba(139, 92, 246, 0.3)", size: 4, glow: 5 },    // violet-500
        { color: "rgba(147, 85, 239, 0.22)", size: 4, glow: 4 },   // violet
        { color: "rgba(155, 78, 232, 0.15)", size: 3, glow: 3 },   // violet-purple
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
                    ? "border-violet-500 bg-violet-500/20"
                    : "border-violet-500/50 bg-transparent"
                    }`}
                style={{
                    mixBlendMode: cursorText ? "normal" : "difference",
                    boxShadow: isHovering
                        ? "0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)"
                        : "0 0 10px rgba(139, 92, 246, 0.3)",
                }}
            >
                {cursorText && (
                    <span className="text-[8px] font-medium lowercase tracking-wider text-violet-400">
                        {cursorText}
                    </span>
                )}
            </div>

            {/* Cursor dot with glow */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 pointer-events-none z-[9999] rounded-full bg-violet-500"
                style={{
                    boxShadow: "0 0 8px rgba(139, 92, 246, 0.8), 0 0 16px rgba(139, 92, 246, 0.5)",
                }}
            />

            {/* Hide default cursor except for elements with .no-cursor */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
        .no-cursor, .no-cursor * {
          cursor: auto !important;
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
