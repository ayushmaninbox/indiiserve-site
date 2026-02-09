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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-neutral-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
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
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white lg:text-3xl">Dashboard</h1>
                    <p className="mt-1 text-neutral-400">Welcome back! Here&apos;s what&apos;s happening.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Enquiries"
                        value={enquiries.length}
                        color="bg-blue-500/20 text-blue-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Pending"
                        value={pendingCount}
                        color="bg-orange-500/20 text-orange-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Solved"
                        value={solvedCount}
                        color="bg-green-500/20 text-green-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatsCard
                        title="Blog Posts"
                        value={blogStats.total}
                        color="bg-purple-500/20 text-purple-400"
                        icon={
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        }
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Enquiry Trend Chart */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-6 text-lg font-semibold text-white">Enquiry Trend</h3>
                        <div className="relative">
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d={areaPath} fill="url(#areaGradient)" />
                                <path d={linePath} fill="none" stroke="#8B5CF6" strokeWidth="2" />
                                {monthData.map((value, index) => {
                                    const x = (index / (monthData.length - 1)) * chartWidth;
                                    const y = chartHeight - (value / maxValue) * chartHeight;
                                    return (
                                        <circle key={index} cx={x} cy={y} r="4" fill="#8B5CF6" />
                                    );
                                })}
                            </svg>
                            <div className="mt-4 flex justify-between text-xs text-neutral-500">
                                {monthLabels.map((label) => (
                                    <span key={label}>{label}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status Donut Chart */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-6 text-lg font-semibold text-white">Enquiry Status</h3>
                        <div className="flex items-center justify-center gap-8">
                            <div className="relative">
                                <svg width="120" height="120" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="12" />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="12"
                                        strokeDasharray={`${solvedDash} 251.2`}
                                        strokeDashoffset="0"
                                        transform="rotate(-90 50 50)"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="12"
                                        strokeDasharray={`${pendingDash} 251.2`}
                                        strokeDashoffset={-solvedDash}
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{total}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="h-3 w-3 rounded-full bg-green-500" />
                                    <span className="text-sm text-neutral-400">Solved ({solvedCount})</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="h-3 w-3 rounded-full bg-orange-500" />
                                    <span className="text-sm text-neutral-400">Pending ({pendingCount})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Enquiries */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Recent Enquiries</h3>
                        <Link
                            href="/admin/enquiries"
                            className="text-sm text-violet-400 hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    {enquiries.length === 0 ? (
                        <p className="text-center text-neutral-500 py-8">No enquiries yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Customer</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Service</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.slice(0, 5).map((enquiry) => (
                                        <tr key={enquiry.id} className="border-b border-white/5">
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{enquiry.name}</p>
                                                    <p className="text-sm text-neutral-500">{enquiry.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-neutral-300">{enquiry.service}</td>
                                            <td className="px-4 py-4 text-neutral-400">
                                                {new Date(enquiry.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${enquiry.status === "solved"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-orange-500/20 text-orange-400"
                                                        }`}
                                                >
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
