"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { rolePermissions, UserRole } from "@/data/users";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if already logged in
        if (localStorage.getItem("isAdminAuthenticated") === "true") {
            const userStr = localStorage.getItem("adminUser");
            if (userStr) {
                const user = JSON.parse(userStr);
                redirectToFirstAllowed(user.role);
            }
        }
    }, []);

    const redirectToFirstAllowed = (role: UserRole) => {
        const permissions = rolePermissions[role] || [];
        const firstAllowed = permissions[0] || "dashboard";
        router.push(`/admin/${firstAllowed}`);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid email or password");
                setIsLoading(false);
                return;
            }

            // Set session in localStorage for client-side auth checks
            localStorage.setItem("isAdminAuthenticated", "true");
            localStorage.setItem("adminUser", JSON.stringify(data.user));

            // Redirect based on role
            redirectToFirstAllowed(data.user.role);
        } catch (err) {
            setError("Server error. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-neutral-950 p-4 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-lime-400/10 blur-[128px]" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[128px]" />

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-lime-400">InDiiServe</h1>
                        <p className="mt-2 text-neutral-400">Admin Panel</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-lime-400/50"
                                placeholder="admin@indiiserve.com"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-lime-400/50"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-full bg-lime-400 py-3 font-bold text-black transition-all hover:bg-lime-300 disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-8 rounded-lg bg-white/5 p-4">
                        <p className="mb-2 text-xs font-medium text-neutral-400">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-neutral-500">
                            <p><span className="text-lime-400">Super Admin:</span> superadmin@indiiserve.com / admin123</p>
                            <p><span className="text-blue-400">Admin:</span> admin@indiiserve.com / admin123</p>
                            <p><span className="text-green-400">Writer:</span> writer@indiiserve.com / writer123</p>
                            <p><span className="text-orange-400">Enquiry:</span> enquiry@indiiserve.com / enquiry123</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
