"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/admin/AuthGuard";
import PaginationControls from "@/components/admin/PaginationControls";
import { AdminRole, AdminUser } from "@/lib/types";
import { roleLabels } from "@/lib/roleConstants";
import { cn } from "@/lib/utils";

// SVG Icons from Marble Site
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ShieldIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [search, setSearch] = useState("");
    const [editUser, setEditUser] = useState<AdminUser | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [resetPasswordUser, setResetPasswordUser] = useState<AdminUser | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
        const userStr = localStorage.getItem("adminUser");
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = users.filter((u) =>
        search
            ? u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
            : true
    );

    const totalItems = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    const deleteUser = async (id: string) => {
        if (id === currentUser?.id) {
            (window as any).showToast?.("Administrative self-termination restricted!", "error");
            return;
        }
        if (!confirm("Revoke all access for this user?")) return;

        try {
            await fetch(`/api/users/${id}`, { method: "DELETE" });
            await loadUsers();
            (window as any).showToast?.("User access revoked", "success");
        } catch (error) {
            console.error("Failed to delete:", error);
            (window as any).showToast?.("Failed to revoke access", "error");
        }
    };

    const saveUser = async (userData: Partial<AdminUser> & { password?: string }, isEdit: boolean) => {
        try {
            if (isEdit && editUser) {
                await fetch(`/api/users/${editUser.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                (window as any).showToast?.("User updated", "success");
            } else {
                await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                (window as any).showToast?.("New user created", "success");
            }
            await loadUsers();
            setEditUser(null);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to save user:", error);
            (window as any).showToast?.("Failed to save user", "error");
        }
    };

    const resetPassword = async (userId: string, newPassword: string) => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });
            (window as any).showToast?.("Password reset successfully", "success");
            setResetPasswordUser(null);
        } catch (error) {
            console.error("Failed to reset password:", error);
            (window as any).showToast?.("Failed to reset password", "error");
        }
    };

    const getRoleColor = (role: AdminRole) => {
        const colors: Record<AdminRole, string> = {
            super_admin: 'bg-red-50 text-red-700 border-red-100',
            admin: 'bg-blue-50 text-blue-700 border-blue-100',
            product_manager: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            content_writer: 'bg-purple-50 text-purple-700 border-purple-100',
            enquiry_handler: 'bg-orange-50 text-orange-700 border-orange-100',
        };
        return colors[role] || 'bg-stone-50 text-stone-700 border-stone-100';
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <AuthGuard requiredPermission="users">
            <div className="space-y-10 animate-in fade-in duration-700 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight italic">Users</h1>
                        <p className="mt-1 text-[10px] font-black text-violet-400/60 uppercase tracking-[0.4em]">Manage administrative personnel and access levels</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <span>+</span> New User
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-4 backdrop-blur-3xl shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3 px-4">
                           <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" /> Personnel Registry
                        </h3>
                        <div className="relative w-full md:w-96 group">
                            <input
                                type="text"
                                placeholder="Search by identity or credential stream..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-sm font-bold text-white focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/40 transition-all placeholder:text-slate-600 selection:bg-violet-500/30"
                            />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors">
                                <SearchIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sector Capacity: {paginatedUsers.length} of {totalItems} active entities</p>
                    <PaginationControls
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemName="users"
                    />
                </div>

                {/* User Table */}
                <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/5">
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">User</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Role</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Created</th>
                                    <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Last Sync</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-24">
                                            <div className="flex flex-col items-center gap-6 text-slate-600">
                                                 <div className="h-20 w-20 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 text-4xl filter grayscale">👤</div>
                                                 <p className="text-[10px] font-black uppercase tracking-[0.4em]">No active personnel found in this sector</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-white/[0.03] transition-all relative">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] text-slate-400 text-sm font-black border border-white/10 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all duration-500 group-hover:scale-110 shadow-xl group-hover:shadow-violet-600/20">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-black text-white text-base leading-tight tracking-tight italic">{user.name}</p>
                                                            {user.id === currentUser?.id && (
                                                                <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.3em] text-violet-400 border border-violet-500/20">Prime Operator</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-500 mt-1.5 transition-colors group-hover:text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={cn(
                                                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg",
                                                    user.role === 'super_admin' ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5" :
                                                    user.role === 'admin' ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5" :
                                                    user.role === 'product_manager' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" :
                                                    user.role === 'content_writer' ? "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-violet-500/5" :
                                                    "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/5"
                                                )}>
                                                    {user.role === 'super_admin' && <ShieldIcon />}
                                                    {roleLabels[user.role]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-xs font-black text-slate-500 tabular-nums">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-6 text-xs font-black text-slate-500 tabular-nums">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "--"}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => setEditUser(user)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all shadow-xl">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => setResetPasswordUser(user)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all shadow-xl">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                        </svg>
                                                    </button>
                                                    {user.id !== currentUser?.id && (
                                                        <button onClick={() => deleteUser(user.id)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-xl">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="pt-6 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.02] border border-white/5">
                        <div className="h-1 w-1 rounded-full bg-violet-500 animate-pulse" />
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Access Cluster Terminal Synchronized</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {(isAddModalOpen || editUser) && (
                <UserModal user={editUser} onClose={() => { setEditUser(null); setIsAddModalOpen(false); }} onSave={saveUser} />
            )}

            {resetPasswordUser && (
                <ResetPasswordModal 
                    user={resetPasswordUser} 
                    onClose={() => setResetPasswordUser(null)} 
                    onReset={(newPassword) => resetPassword(resetPasswordUser.id, newPassword)} 
                />
            )}
        </AuthGuard>
    );
}

function UserModal({ user, onClose, onSave }: { user: AdminUser | null; onClose: () => void; onSave: (data: any, isEdit: boolean) => void }) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<AdminRole>(user?.role || "admin");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, email, password: password || undefined, role }, !!user);
    };

    const inputClasses = "w-full rounded-2xl bg-white/[0.03] border border-white/5 px-6 py-4.5 text-sm font-bold text-white outline-none focus:border-violet-500/40 focus:ring-8 focus:ring-violet-500/5 transition-all placeholder:text-slate-600 selection:bg-violet-500/30";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 bg-[#030014]/90 backdrop-blur-2xl" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-[3rem] border border-white/5 bg-[#030014] p-10 shadow-2xl animate-in fade-in zoom-in duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
                        {user ? "Edit User" : "New User"}
                    </h2>
                    <button onClick={onClose} className="h-12 w-12 rounded-2xl border border-white/5 bg-white/[0.03] text-slate-500 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all shadow-xl">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} placeholder="Operator Name" />
                    </div>
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!!user} className={cn(inputClasses, "disabled:opacity-40 disabled:bg-transparent disabled:border-white/5")} placeholder="identity@nexus.io" />
                    </div>
                    {!user && (
                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClasses} placeholder="••••••••" />
                        </div>
                    )}
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as AdminRole)} className={cn(inputClasses, "cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234b5563%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19%209-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_1.5rem_center] bg-no-repeat uppercase text-[11px] tracking-widest")}>
                            <option value="super_admin" className="bg-[#030014]">Super Admin</option>
                            <option value="admin" className="bg-[#030014]">Admin</option>
                            <option value="content_writer" className="bg-[#030014]">Content Writer</option>
                            <option value="enquiry_handler" className="bg-[#030014]">Enquiry Handler</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-white/5 bg-white/[0.03] py-4.5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-white hover:bg-white/5 transition-all shadow-xl">Abort</button>
                        <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 py-4.5 text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            {user ? "Save Changes" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ResetPasswordModal({ user, onClose, onReset }: { user: AdminUser; onClose: () => void; onReset: (newPassword: string) => void }) {
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) { alert("Security keys must exceed 6 metric units."); return; }
        onReset(newPassword);
    };

    const inputClasses = "w-full rounded-2xl bg-white/[0.03] border border-white/5 px-6 py-4.5 text-sm font-bold text-white outline-none focus:border-violet-500/40 focus:ring-8 focus:ring-violet-500/5 transition-all placeholder:text-slate-600 selection:bg-violet-500/30";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 bg-[#030014]/90 backdrop-blur-2xl" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-[3rem] border border-white/5 bg-[#030014] p-10 shadow-2xl animate-in fade-in zoom-in duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Reset Password</h2>
                    <button onClick={onClose} className="h-12 w-12 rounded-2xl border border-white/5 bg-white/[0.03] text-slate-500 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all shadow-xl">
                        <CloseIcon />
                    </button>
                </div>
                <p className="mb-10 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4 relative z-10">Personnel Node: {user.email}</p>
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" className={inputClasses} />
                    </div>
                    <button type="submit" className="w-full rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Reset Password</button>
                </form>
            </div>
        </div>
    );
}
