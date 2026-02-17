"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AdminUser, AdminRole } from "@/lib/types";
import { rolePermissions, roleLabels } from "@/lib/roleConstants";
import AuthGuard from "@/components/admin/AuthGuard";
import { ToastContainer } from "@/components/ui/Toast";

// SVG Icons from Marble Site
const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const BoxIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const BlogIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
);

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType;
    href: string;
    badge?: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);
    const [enquiryCount, setEnquiryCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        setIsMounted(true);
        if (isLoginPage) return;

        const userStr = localStorage.getItem("adminUser");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }

        // Get initial enquiry count
        const updateCount = () => {
            try {
                const enquiriesStr = localStorage.getItem("enquiries");
                if (enquiriesStr) {
                    const enquiries = JSON.parse(enquiriesStr);
                    if (Array.isArray(enquiries)) {
                        const pending = enquiries.filter((e: { status?: string }) => e.status !== "solved").length;
                        setEnquiryCount(pending);
                    }
                }
            } catch (error) {
                console.warn("Failed to parse enquiries from localStorage", error);
            }
        };
        
        updateCount();
        window.addEventListener('storage', updateCount);
        return () => window.removeEventListener('storage', updateCount);
    }, [isLoginPage]);

    // Don't apply layout to login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!isMounted) return null;

    const handleLogout = () => {
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("adminUser");
        router.push("/admin/login");
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        if (!user) return;

        const users = JSON.parse(localStorage.getItem("adminUsers") || "[]");
        const currentUser = users.find((u: AdminUser) => u.id === user.id);

        if (!currentUser || currentUser.password !== passwordForm.current) {
            setPasswordError("Current password is incorrect");
            return;
        }
        if (passwordForm.new.length < 6) {
            setPasswordError("New password must be at least 6 characters");
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            setPasswordError("Passwords do not match");
            return;
        }

        const updatedUsers = users.map((u: AdminUser) =>
            u.id === user.id ? { ...u, password: passwordForm.new } : u
        );
        localStorage.setItem("adminUsers", JSON.stringify(updatedUsers));
        
        setIsPasswordModalOpen(false);
        setPasswordForm({ current: '', new: '', confirm: '' });
        (window as any).showToast?.("Password updated successfully", "success");
    };

    const navItems: NavItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: DashboardIcon,
        },
        {
            id: "portfolio",
            label: "Portfolio",
            href: "/admin/portfolio",
            icon: BoxIcon,
        },
        {
            id: "enquiries",
            label: "Enquiries",
            href: "/admin/enquiries",
            badge: enquiryCount,
            icon: ChatIcon,
        },
        {
            id: "blogs",
            label: "Blogs",
            href: "/admin/blogs",
            icon: BlogIcon,
        },
        {
            id: "users",
            label: "Users",
            href: "/admin/users",
            icon: UsersIcon,
        },
    ];

    const permissions = user ? rolePermissions[user.role as AdminRole] || [] : [];
    const filteredNavItems = navItems.filter((item) => permissions.includes(item.id));

    return (
        <AuthGuard>
            <div 
                className="min-h-screen bg-[#030014] text-white font-poppins selection:bg-violet-500/30"
                style={{ "--font-sans": "'Poppins', sans-serif", "--font-heading": "'Poppins', sans-serif" } as any}
            >
                {/* Background Glows */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
                </div>

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-white/5 bg-[#030014]/80 backdrop-blur-2xl transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="flex h-full flex-col">
                        {/* Logo / Branding */}
                        <div className="p-8 border-b border-white/5">
                            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 shadow-lg transition-transform group-hover:scale-110 overflow-hidden p-2">
                                    <img src="/white_logo.png" alt="InDiiServe.ai Logo" className="h-full w-full object-contain" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white tracking-tight">Admin Console</div>
                                    <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase group-hover:text-violet-400 transition-colors">
                                        InDii<span className="text-violet-500">Serve.ai</span> Consulting
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {filteredNavItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isActive
                                            ? "bg-white/5 text-violet-400 border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                                            : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                                        }`}
                                    >
                                        <div className={`${isActive ? "text-violet-400" : "text-slate-500"}`}>
                                            <item.icon />
                                        </div>
                                        <span>{item.label}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="ml-auto rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-2 py-0.5 text-[9px] font-semibold shadow-lg shadow-violet-500/20">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}

                            <div className="my-6 border-t border-white/5 mx-2" />

                            <Link
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all"
                            >
                                <GlobeIcon />
                                <span>View Website</span>
                            </Link>
                            
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all"
                            >
                                <KeyIcon />
                                <span>Change Password</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                            >
                                <LogoutIcon />
                                <span>Logout</span>
                            </button>
                        </nav>

                        {/* User Profile */}
                        {user && (
                            <div className="p-4 mt-auto border-t border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-colors hover:bg-white/[0.05]">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold text-xs ring-1 ring-white/10 uppercase">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-xs font-bold text-white uppercase tracking-wider">{user.name}</p>
                                        <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">{roleLabels[user.role as AdminRole]}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative z-10">
                    {/* Mobile Menu Toggle (Floating) */}
                    <div className="lg:hidden fixed top-6 left-6 z-50">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 rounded-xl bg-[#030014]/80 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white transition-all shadow-2xl"
                        >
                            <MenuIcon />
                        </button>
                    </div>

                    {/* Page Content */}
                    <main className="flex-1 p-6 lg:p-12 max-w-7xl w-full mx-auto relative">
                        {children}
                    </main>
                </div>

                {/* Password Modal (Standardized) */}
                {isPasswordModalOpen && (
                    <PasswordModal user={user} onClose={() => setIsPasswordModalOpen(false)} />
                )}

                <ToastContainer />
            </div>
        </AuthGuard>
    );
}

function PasswordModal({ user, onClose }: { user: AdminUser | null; onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!user) return;

        // Validate current password
        const users = JSON.parse(localStorage.getItem("adminUsers") || "[]");
        const currentUser = users.find((u: AdminUser) => u.id === user.id);

        if (!currentUser || currentUser.password !== currentPassword) {
            setError("Current password is incorrect");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Update password
        const updatedUsers = users.map((u: AdminUser) =>
            u.id === user.id ? { ...u, password: newPassword } : u
        );
        localStorage.setItem("adminUsers", JSON.stringify(updatedUsers));

        setSuccess(true);
        setTimeout(onClose, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-neutral-950 p-8 shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Update Security Key</h2>

                {success ? (
                    <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                            <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-white font-bold uppercase tracking-widest text-xs">Security Protocol Updated</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-[10px] font-bold uppercase tracking-widest text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Current Credentials</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">New Access Key</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Verify New Key</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-2xl border border-white/5 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white/5 transition-all"
                            >
                                Abort
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Update Security
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
