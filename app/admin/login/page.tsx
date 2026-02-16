"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminRole } from "@/lib/types";
import { rolePermissions } from "@/lib/roleConstants";

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

    const redirectToFirstAllowed = (role: AdminRole) => {
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
        <main className="relative min-h-screen flex items-center justify-center bg-[#030014] font-jost overflow-hidden p-6 selection:bg-violet-500/30">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Login Container */}
            <div className="relative w-full max-w-xl">
                <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl p-10 lg:p-16 relative overflow-hidden group">
                    {/* Inner Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors duration-1000" />
                    
                    {/* Header */}
                    <div className="text-center mb-16 relative z-10">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-black text-4xl shadow-2xl shadow-violet-500/20 mb-8 transition-transform duration-700 hover:rotate-[10deg] hover:scale-110">I</div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Admin Console</h1>
                        <p className="text-[10px] font-black text-violet-400/60 uppercase tracking-[0.4em] leading-relaxed">Editorial & Asset Management Node</p>
                    </div>

                    {/* Error Feedback */}
                    {error && (
                        <div className="mb-10 rounded-2xl bg-red-500/5 border border-red-500/20 p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identity Vector (Email)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.04] px-8 py-5 text-sm font-bold text-white outline-none focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5 transition-all placeholder:text-slate-600"
                                placeholder="name@indiiserve.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Key (Password)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.04] px-8 py-5 text-sm font-bold text-white outline-none focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5 transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 rounded-[1.5rem] bg-gradient-to-r from-indigo-500 to-violet-600 py-6 font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-2xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Synchronizing Session..." : "Authorize Access"}
                        </button>
                    </form>

                    {/* Meta Info */}
                    <div className="mt-16 pt-12 border-t border-white/5 relative z-10">
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Credentials Gate:</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-2 group/trace hover:bg-white/[0.04] transition-colors duration-500">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight group-hover/trace:text-violet-400/60 transition-colors">Super Admin Hub</p>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-1">
                                        <code className="text-[11px] font-bold text-slate-300">superadmin@indiiserve.com</code>
                                        <code className="text-[10px] font-black text-violet-400 bg-violet-500/5 px-3 py-1 rounded-full border border-violet-500/10">admin123</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer Link */}
                <div className="mt-10 text-center relative z-10">
                    <button 
                        onClick={() => router.push("/")}
                        className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-violet-400 transition-all duration-300 flex items-center gap-3 mx-auto"
                    >
                        <span className="w-8 h-[1px] bg-slate-800" />
                        Return to Public Interface
                        <span className="w-8 h-[1px] bg-slate-800" />
                    </button>
                </div>
            </div>
        </main>
    );
}
