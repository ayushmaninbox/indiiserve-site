"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#030014] flex items-center justify-center px-6 font-poppins selection:bg-violet-500/30 relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[200px]" />
            </div>

            <div className="relative z-10 text-center max-w-lg">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[10rem] sm:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent leading-none tracking-tighter select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-20 w-20 rounded-3xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.3)]">
                            <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                    Page Not Found
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-10 max-w-sm mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-2xl shadow-violet-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Back to Home
                    </Link>
                    <Link
                        href="/work"
                        className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all active:scale-[0.97]"
                    >
                        View Our Work
                    </Link>
                </div>

                {/* Subtle branding */}
                <p className="mt-16 text-[9px] font-bold text-slate-700 uppercase tracking-[0.5em]">
                    InDiiServe.ai
                </p>
            </div>
        </main>
    );
}
