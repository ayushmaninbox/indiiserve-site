"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { rolePermissions, roleLabels, UserRole, AdminUser } from "@/data/users";
import AuthGuard from "@/components/admin/AuthGuard";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    badge?: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [enquiryCount, setEnquiryCount] = useState(0);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) return;

        const userStr = localStorage.getItem("adminUser");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }

        // Get enquiry count
        const enquiries = JSON.parse(localStorage.getItem("enquiries") || "[]");
        const pending = enquiries.filter((e: { status?: string }) => e.status !== "solved").length;
        setEnquiryCount(pending);
    }, [isLoginPage]);

    // Don't apply layout to login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    const handleLogout = () => {
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("adminUser");
        router.push("/admin/login");
    };

    const navItems: NavItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            id: "portfolio",
            label: "Portfolio",
            href: "/admin/portfolio",
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            id: "enquiries",
            label: "Enquiries",
            href: "/admin/enquiries",
            badge: enquiryCount,
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
        },
        {
            id: "blogs",
            label: "Blogs",
            href: "/admin/blogs",
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
        {
            id: "users",
            label: "Users",
            href: "/admin/users",
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
    ];

    const permissions = user ? rolePermissions[user.role as UserRole] || [] : [];
    const filteredNavItems = navItems.filter((item) => permissions.includes(item.id));

    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-black font-sans text-white">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-neutral-950 border-r border-white/5 transition-transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex h-full flex-col">
                        {/* Logo */}
                        <div className="flex items-center justify-between border-b border-white/10 p-6">
                            <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight text-white">
                                InDii<span className="text-indigo-500">Serve</span>
                            </Link>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden text-zinc-400 hover:text-white"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto p-4">
                            <ul className="space-y-1">
                                {filteredNavItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                    return (
                                        <li key={item.id}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsSidebarOpen(false)}
                                                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all text-sm font-medium ${isActive
                                                    ? "bg-indigo-500/10 text-indigo-400"
                                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                <span className={`${isActive ? "text-indigo-400" : "text-zinc-500"}`}>
                                                    {item.icon}
                                                </span>
                                                {item.label}
                                                {item.badge !== undefined && item.badge > 0 && (
                                                    <span className="ml-auto rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Bottom Actions */}
                        <div className="border-t border-white/10 p-4 space-y-1">
                            <Link
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Website
                            </Link>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Change Password
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>

                        {/* User Profile */}
                        {user && (
                            <div className="border-t border-white/10 p-4">
                                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                                        <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">{roleLabels[user.role as UserRole]}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-black px-8">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="hidden lg:block">
                            <h2 className="text-sm font-medium text-zinc-400">
                                {navItems.find(i => pathname.startsWith(i.href))?.label || "Admin Console"}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 outline outline-4 outline-emerald-500/20" />
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-8 lg:p-10 max-w-7xl w-full mx-auto">
                        {children}
                    </main>
                </div>

                {/* Password Change Modal */}
                {isPasswordModalOpen && (
                    <PasswordModal
                        user={user}
                        onClose={() => setIsPasswordModalOpen(false)}
                    />
                )}
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
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6">
                <h2 className="mb-6 text-xl font-bold text-white">Change Password</h2>

                {success ? (
                    <div className="py-8 text-center">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20">
                            <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-white">Password changed successfully!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-500/50"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-500/50"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-500/50"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-full border border-white/10 py-3 font-medium text-white hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-full bg-violet-500 py-3 font-bold text-white hover:bg-violet-400"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
