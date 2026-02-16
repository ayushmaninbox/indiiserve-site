"use client";

import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColors = {
        success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        error: "bg-red-500/10 border-red-500/20 text-red-400",
        info: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    };

    const icons = {
        success: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div
            className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } ${bgColors[type]}`}
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                {icons[type]}
            </div>
            <p className="text-sm font-bold tracking-tight">{message}</p>
        </div>
    );
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<{ id: number; message: string; type: any }[]>([]);

    const addToast = (message: string, type: any = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    // This is a simple global way to access toasts for now
    useEffect(() => {
        (window as any).showToast = addToast;
    }, []);

    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                />
            ))}
        </>
    );
}
