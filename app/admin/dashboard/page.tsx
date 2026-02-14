"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/admin/AuthGuard";
import { blogs } from "@/data/blogs";

interface Enquiry {
    id: string;
    name: string;
    email: string;
    service: string;
    status?: string;
    submittedAt: string;
}

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
    return (
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-white/5 transition-all hover:bg-neutral-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} shadow-sm border border-white/5`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [blogStats, setBlogStats] = useState({ total: 0, likes: 0, comments: 0 });

    useEffect(() => {
        // Load enquiries
        const stored = localStorage.getItem("enquiries");
        if (stored) {
            setEnquiries(JSON.parse(stored));
        }

        // Load blog stats
        let totalLikes = 0;
        let totalComments = 0;
        blogs.forEach((blog) => {
            const likes = parseInt(localStorage.getItem(`blog-likes-${blog.slug}`) || "0", 10);
            const comments = JSON.parse(localStorage.getItem(`blog-comments-${blog.slug}`) || "[]");
            totalLikes += likes;
            totalComments += comments.length;
        });
        setBlogStats({ total: blogs.length, likes: totalLikes, comments: totalComments });
    }, []);

    const pendingCount = enquiries.filter((e) => e.status !== "solved").length;
    const solvedCount = enquiries.filter((e) => e.status === "solved").length;

    // Generate mock monthly data for charts
    const monthLabels = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    const monthData = [3, 5, 4, 8, 6, enquiries.length];

    // SVG Chart dimensions
    const chartWidth = 400;
    const chartHeight = 150;
    const maxValue = Math.max(...monthData, 1);

    // Generate path for area chart
    const points = monthData.map((value, index) => {
        const x = (index / (monthData.length - 1)) * chartWidth;
        const y = chartHeight - (value / maxValue) * chartHeight;
        return `${x},${y}`;
    });
    const areaPath = `M0,${chartHeight} L${points.join(" L")} L${chartWidth},${chartHeight} Z`;
    const linePath = `M${points.join(" L")}`;

    // Donut chart
    const total = pendingCount + solvedCount || 1;
    const solvedPercent = (solvedCount / total) * 100;
    const pendingPercent = (pendingCount / total) * 100;
    const solvedDash = (solvedPercent / 100) * 251.2;
    const pendingDash = (pendingPercent / 100) * 251.2;

    return (
        <AuthGuard requiredPermission="dashboard">
            <div className="space-y-10">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="mt-1 text-sm font-medium text-zinc-400">Overview of your site's activity and performance.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Enquiries"
                        value={enquiries.length}
                        color="bg-indigo-500/20 text-indigo-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Pending"
                        value={pendingCount}
                        color="bg-orange-500/20 text-orange-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Solved"
                        value={solvedCount}
                        color="bg-emerald-500/20 text-emerald-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Blog Posts"
                        value={blogStats.total}
                        color="bg-blue-500/20 text-blue-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        }
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Enquiry Trend Chart */}
                    <div className="bg-neutral-900/50 rounded-2xl p-8 border border-white/5">
                        <h3 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Enquiry Trend</h3>
                        <div className="relative">
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 drop-shadow-sm">
                                <path d={areaPath} fill="none" />
                                <path d={linePath} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                {monthData.map((value, index) => {
                                    const x = (index / (monthData.length - 1)) * chartWidth;
                                    const y = chartHeight - (value / maxValue) * chartHeight;
                                    return (
                                        <circle key={index} cx={x} cy={y} r="4" fill="#818cf8" className="animate-pulse" />
                                    );
                                })}
                            </svg>
                            <div className="mt-6 flex justify-between px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                {monthLabels.map((label) => (
                                    <span key={label}>{label}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status Donut Chart */}
                    <div className="bg-neutral-900/50 rounded-2xl p-8 border border-white/5">
                        <h3 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Enquiry Status</h3>
                        <div className="flex items-center justify-around">
                            <div className="relative">
                                <svg width="140" height="140" viewBox="0 0 100 100" className="drop-shadow-sm">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#10B981"
                                        strokeWidth="10"
                                        strokeDasharray={`${solvedDash} 251.2`}
                                        strokeDashoffset="0"
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#F97316"
                                        strokeWidth="10"
                                        strokeDasharray={`${pendingDash} 251.2`}
                                        strokeDashoffset={-solvedDash}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-white">{total}</span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</span>
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
                                    <div>
                                        <p className="text-xs font-bold text-white tracking-tight">{solvedCount} Solved</p>
                                        <p className="text-[10px] font-medium text-zinc-500">{((solvedCount / total) * 100).toFixed(0)}% completion</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/20" />
                                    <div>
                                        <p className="text-xs font-bold text-white tracking-tight">{pendingCount} Pending</p>
                                        <p className="text-[10px] font-medium text-zinc-500">{((pendingCount / total) * 100).toFixed(0)}% required</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Enquiries */}
                <div className="bg-neutral-900/50 rounded-2xl p-8 border border-white/5">
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Recent Enquiries</h3>
                        <Link
                            href="/admin/enquiries"
                            className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors border-b border-indigo-400/0 hover:border-indigo-400/100"
                        >
                            View Console →
                        </Link>
                    </div>

                    {enquiries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-700">
                            <svg className="w-16 h-16 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className="font-semibold uppercase tracking-widest text-xs">No active enquiries</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-4 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer</th>
                                        <th className="px-4 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">Service</th>
                                        <th className="px-4 py-5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</th>
                                        <th className="px-4 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {enquiries.slice(0, 5).map((enquiry) => (
                                        <tr key={enquiry.id} className="group hover:bg-white/5 transition-all">
                                            <td className="px-4 py-6">
                                                <div className="font-bold text-white">{enquiry.name}</div>
                                                <div className="text-xs font-medium text-zinc-500">{enquiry.email}</div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{enquiry.service}</span>
                                            </td>
                                            <td className="px-4 py-6 text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                                                {new Date(enquiry.submittedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-6 text-right">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter shadow-sm border ${enquiry.status === "solved"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                                        }`}
                                                >
                                                    <span className={`h-1.5 w-1.5 rounded-full ${enquiry.status === "solved" ? "bg-emerald-500" : "bg-orange-500"}`} />
                                                    {enquiry.status === "solved" ? "Solved" : "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
