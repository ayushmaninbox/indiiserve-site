"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "@/components/admin/AuthGuard";
import { cn } from "@/lib/utils";
import StatsCard from "@/components/admin/StatsCard";
import { AdminUser, AdminRole } from "@/lib/types";
import { roleColors, roleLabels } from "@/lib/roleConstants";

interface Enquiry {
    id: string;
    name: string;
    email: string;
    service: string;
    status?: string;
    submittedAt: string;
}

// SVG Icons from Marble Site
const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BlogIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const TrendUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function DashboardPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [blogStats, setBlogStats] = useState({ total: 0, likes: 0, comments: 0 });
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        // Load enquiries
        const stored = localStorage.getItem("enquiries");
        if (stored) {
            setEnquiries(JSON.parse(stored));
        }

        // Load blog stats
        const loadBlogStats = async () => {
            try {
                const res = await fetch("/api/blogs");
                if (res.ok) {
                    const blogs = await res.json();
                    let totalLikes = 0;
                    let totalComments = 0;
                    blogs.forEach((blog: any) => {
                        const likes = parseInt(localStorage.getItem(`blog-likes-${blog.slug}`) || "0", 10);
                        const comments = JSON.parse(localStorage.getItem(`blog-comments-${blog.slug}`) || "[]");
                        totalLikes += (blog.likes || 0) + likes;
                        totalComments += (blog.comments?.length || 0) + comments.length;
                    });
                    setBlogStats({ total: blogs.length, likes: totalLikes, comments: totalComments });
                }
            } catch (error) {
                console.error("Failed to load blog stats:", error);
            }
        };
        loadBlogStats();

        // User info
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserName(user.name?.split(' ')[0] || 'Admin');
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const pendingCount = enquiries.filter((e) => e.status !== "solved").length;
    const solvedCount = enquiries.filter((e) => e.status === "solved").length;

    // Charts data logic from Marble Site
    const getMonthlyData = () => {
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('en-US', { month: 'short' });
            const count = enquiries.filter(e => {
                const enquiryDate = new Date(e.submittedAt);
                return enquiryDate.getMonth() === date.getMonth() && 
                       enquiryDate.getFullYear() === date.getFullYear();
            }).length;
            months.push({ month: monthName, count });
        }
        return months;
    };

    const monthlyData = getMonthlyData();
    const maxMonthlyCount = Math.max(...monthlyData.map(m => m.count), 1);

    const chartWidth = 100;
    const chartHeight = 100;
    const MAX_Y_PERCENT = 5;
    const MIN_Y_PERCENT = 100;
    const Y_RANGE = MIN_Y_PERCENT - MAX_Y_PERCENT;

    const chartPoints = monthlyData.map((d, i) => {
        const x = (i / (monthlyData.length - 1)) * chartWidth;
        const y = MIN_Y_PERCENT - (d.count / maxMonthlyCount) * Y_RANGE;
        return `${x},${y}`;
    }).join(' ');

    return (
        <AuthGuard requiredPermission="dashboard">
            <div className="space-y-10 font-poppins animate-in fade-in duration-700 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight italic">Dashboard</h1>
                        <p className="mt-1 text-xs text-slate-500 uppercase tracking-widest font-medium">Hello, {userName} 👋</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Enquiries"
                        value={enquiries.length}
                        icon={<ChatIcon />}
                        iconBgColor="bg-indigo-500/10"
                        iconColor="text-indigo-400"
                        trend={{ text: 'Connected', icon: <TrendUpIcon />, color: 'text-indigo-400' }}
                    />
                    <StatsCard
                        title="Pending"
                        value={pendingCount}
                        icon={<ClockIcon />}
                        iconBgColor="bg-amber-500/10"
                        iconColor="text-amber-400"
                        trend={{ text: 'Requires attention', color: 'text-amber-400' }}
                    />
                    <StatsCard
                        title="Resolved"
                        value={solvedCount}
                        icon={<CheckCircleIcon />}
                        iconBgColor="bg-emerald-500/10"
                        iconColor="text-emerald-400"
                        trend={{ text: 'Completed', color: 'text-emerald-400' }}
                    />
                    <StatsCard
                        title="Total Blogs"
                        value={blogStats.total}
                        icon={<BlogIcon />}
                        iconBgColor="bg-violet-500/10"
                        iconColor="text-violet-400"
                        trend={{ text: 'Published', icon: <TrendUpIcon />, color: 'text-violet-400' }}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Enquiry Trend Chart */}
                    <div className="lg:col-span-2 bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-violet-600/10 transition-colors" />
                        
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Enquiry Trend</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Monthly engagement metrics</p>
                            </div>
                            <span className="text-[10px] text-violet-400 font-bold bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">Last 6 Months</span>
                        </div>
                        
                        <div className="flex gap-6 h-64 w-full pt-4 relative z-10">
                            <div className="flex flex-col justify-between py-0 text-[10px] text-slate-600 font-black text-right w-10 h-full select-none tabular-nums">
                                {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                                    <span key={ratio} className="leading-none transform -translate-y-[50%] first:translate-y-0 last:translate-y-0">
                                        {Math.round(maxMonthlyCount * ratio)}
                                    </span>
                                ))}
                            </div>

                            <div className="relative flex-1 h-full">
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {[0, 25, 50, 75, 100].map(y => (
                                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                    ))}

                                    <polygon points={`0,100 ${chartPoints} 100,100`} fill="url(#chartGradient)" />
                                    <polyline points={chartPoints} fill="none" stroke="#8B5CF6" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

                                    {monthlyData.map((d, i) => {
                                        const x = (i / (monthlyData.length - 1)) * 100;
                                        const y = MIN_Y_PERCENT - (d.count / maxMonthlyCount) * Y_RANGE;
                                        return (
                                            <circle key={i} cx={x} cy={y} r="3.5" className="fill-[#030014] stroke-violet-500 stroke-[2px]" vectorEffect="non-scaling-stroke" />
                                        );
                                    })}
                                </svg>
                                
                                <div className="flex justify-between mt-6 text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] absolute top-full left-0 w-full">
                                    {monthlyData.map((d, i) => (
                                        <span key={i}>{d.month}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] -ml-32 -mb-32 group-hover:bg-indigo-600/10 transition-colors" />
                        
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div>
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Status</h3>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Today</p>
                            </div>
                            <span className="text-[9px] text-slate-500 bg-white/[0.03] border border-white/5 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em]">Live Data</span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center py-4 relative z-10">
                            <div className="relative w-48 h-48 mb-10">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                                    <circle
                                        cx="18" cy="18" r="14" fill="none"
                                        stroke="#10b981" strokeWidth="4"
                                        strokeDasharray={`${enquiries.length > 0 ? (solvedCount / enquiries.length) * 88 : 0} 88`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <circle
                                        cx="18" cy="18" r="14" fill="none"
                                        stroke="#f59e0b" strokeWidth="4"
                                        strokeDasharray={`${enquiries.length > 0 ? (pendingCount / enquiries.length) * 88 : 0} 88`}
                                        strokeDashoffset={`${enquiries.length > 0 ? -(solvedCount / enquiries.length) * 88 : 0}`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white leading-none tracking-tighter tabular-nums">{enquiries.length}</span>
                                    <span className="text-[9px] uppercase tracking-[0.4em] text-slate-500 mt-2 font-black">Total Nodes</span>
                                </div>
                            </div>
                            
                            <div className="w-full space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Resolved</span>
                                    </div>
                                    <span className="text-sm font-black text-emerald-400 tabular-nums">{(enquiries.length > 0 ? (solvedCount / enquiries.length * 100) : 0).toFixed(0)}%</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pending</span>
                                    </div>
                                    <span className="text-sm font-black text-amber-400 tabular-nums">{(enquiries.length > 0 ? (pendingCount / enquiries.length * 100) : 0).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden mb-12 backdrop-blur-3xl">
                    <div className="flex items-center justify-between p-10 border-b border-white/5">
                        <div>
                             <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Recent enquiries</h3>
                             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Latest incoming communications</p>
                        </div>
                        <Link
                            href="/admin/enquiries"
                            className="inline-flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-violet-400 hover:bg-white/5 transition-all group"
                        >
                            Open Matrix <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.03]">
                                     <th className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-10 py-5 italic">Customer</th>
                                     <th className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-10 py-5 italic">Service</th>
                                     <th className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-10 py-5 italic">Date</th>
                                     <th className="text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-10 py-5 italic">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {enquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center">
                                            <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-700 italic">No incoming telemetry detected</p>
                                        </td>
                                    </tr>
                                ) : (
                                    enquiries.slice(0, 5).map((enquiry) => (
                                        <tr key={enquiry.id} className="group hover:bg-white/[0.03] transition-all duration-500">
                                            <td className="px-10 py-8">
                                                <div className="font-black text-sm text-white tracking-tight group-hover:text-violet-400 transition-colors uppercase italic">{enquiry.name}</div>
                                                <div className="text-[10px] font-bold text-slate-600 mt-1 lowercase tracking-widest">{enquiry.email}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{enquiry.service}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-[11px] font-black text-slate-500 tabular-nums uppercase tracking-widest">
                                                    {new Date(enquiry.submittedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] ${
                                                    enquiry.status === "solved"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${enquiry.status === "solved" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`} />
                                                    {enquiry.status === "solved" ? "Synchronized" : "Pending Intel"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
