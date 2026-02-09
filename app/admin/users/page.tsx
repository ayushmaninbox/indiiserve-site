"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/admin/AuthGuard";
import { UserRole, roleLabels, roleColors } from "@/data/users";

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    lastLogin: string | null;
}

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [search, setSearch] = useState("");
    const [editUser, setEditUser] = useState<AdminUser | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [resetPasswordUser, setResetPasswordUser] = useState<AdminUser | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        loadUsers();
        const userStr = localStorage.getItem("adminUser");
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }, []);

    const loadUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    const filtered = users.filter((u) =>
        search
            ? u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
            : true
    );

    const paginatedData = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    const deleteUser = async (id: string) => {
        if (id === currentUser?.id) {
            alert("Administrative self-termination is restricted!");
            return;
        }
        if (!confirm("Revoke all access for this user?")) return;

        try {
            await fetch(`/api/users/${id}`, { method: "DELETE" });
            await loadUsers();
        } catch (error) {
            console.error("Failed to delete:", error);
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
            } else {
                await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
            }
            await loadUsers();
            setEditUser(null);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Failed to save user:", error);
        }
    };

    const resetPassword = async (userId: string, newPassword: string) => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });
            setResetPasswordUser(null);
        } catch (error) {
            console.error("Failed to reset password:", error);
        }
    };

    return (
        <AuthGuard requiredPermission="users">
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Personnel Console</h1>
                        <p className="mt-1 text-sm font-medium text-zinc-500">Govern administrative roles and security permissions across the workspace.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-zinc-900/20 hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        Provision User
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4 bg-white p-6 rounded-[1.5rem] border border-zinc-200 shadow-sm">
                    <div className="relative flex-1 max-w-lg">
                        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Identify users by name or email signature..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-zinc-100 bg-zinc-50 pl-11 pr-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* User Directory */}
                <div className="rounded-[2rem] border border-zinc-200 bg-white overflow-hidden shadow-xl shadow-zinc-200/10">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Identity</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Security Clearance</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Onboarding</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Last Activity</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {paginatedData.map((user) => (
                                    <tr key={user.id} className="group hover:bg-zinc-50/50 transition-all duration-300">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 text-sm font-black border border-zinc-200 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-zinc-900 uppercase tracking-tight text-sm">{user.name}</p>
                                                        {user.id === currentUser?.id && (
                                                            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-black uppercase text-indigo-600 border border-indigo-100">Active Session</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-medium text-zinc-400 transition-colors group-hover:text-zinc-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                                                user.role === 'super_admin' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                'bg-zinc-100 text-zinc-500 border-zinc-200'
                                            }`}>
                                                {roleLabels[user.role]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-xs font-bold text-zinc-400 tracking-tight">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-6 text-xs font-bold text-zinc-400 tracking-tight">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "--"}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setEditUser(user as any)} className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition-colors">Modify</button>
                                                <button onClick={() => setResetPasswordUser(user as any)} className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-sky-600 transition-colors">Key Reset</button>
                                                {user.id !== currentUser?.id && (
                                                    <button onClick={() => deleteUser(user.id)} className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-200 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Hub */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-6 pt-6">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Registry Page</span>
                             <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-600/30">{page}</span>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">of {totalPages}</span>
                        </div>
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Credential Provisioning */}
            {(isAddModalOpen || editUser) && (
                <UserModal user={editUser} onClose={() => { setEditUser(null); setIsAddModalOpen(false); }} onSave={saveUser} />
            )}

            {resetPasswordUser && (
                <ResetPasswordModal user={resetPasswordUser} onClose={() => setResetPasswordUser(null)} onReset={(newPassword) => resetPassword(resetPasswordUser.id, newPassword)} />
            )}
        </AuthGuard>
    );
}

function UserModal({ user, onClose, onSave }: { user: AdminUser | null; onClose: () => void; onSave: (data: any, isEdit: boolean) => void }) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>(user?.role || "admin");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user && !password) { alert("Initialization requires a security key."); return; }
        onSave({ name, email, password: password || undefined, role }, !!user);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm shadow-inner" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-[2.5rem] border border-zinc-200 bg-white p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <h2 className="mb-8 text-3xl font-black tracking-tight text-zinc-900 uppercase">
                    {user ? "Modify User" : "Provision User"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Legal Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Reference</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!!user} className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner disabled:opacity-50" />
                    </div>
                    {!user && (
                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Initial Security Key</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" />
                        </div>
                    )}
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">Clearance Level</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-800 outline-none shadow-inner">
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="content_writer">Content Writer</option>
                            <option value="enquiry_handler">Enquiry Handler</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 rounded-full border border-zinc-200 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 transition-all">Abort</button>
                        <button type="submit" className="flex-1 rounded-full bg-indigo-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">
                            {user ? "Commit" : "Authorize"}
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
        if (newPassword.length < 6) { alert("Security keys must exceed 6 character units."); return; }
        onReset(newPassword);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm shadow-inner" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-[2.5rem] border border-zinc-200 bg-white p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <h2 className="mb-2 text-3xl font-black tracking-tight text-zinc-900 uppercase">Key Override</h2>
                <p className="mb-8 text-xs font-bold text-indigo-600 uppercase tracking-widest">Protocol for: {user.email}</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-400">New Security Key</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" />
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 rounded-full border border-zinc-200 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 transition-all">Abort</button>
                        <button type="submit" className="flex-1 rounded-full bg-rose-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-95">Finalize Override</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
