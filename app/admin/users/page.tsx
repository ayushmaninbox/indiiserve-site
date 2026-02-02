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
            alert("You cannot delete yourself!");
            return;
        }
        if (!confirm("Delete this user?")) return;

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
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Users</h1>
                        <p className="mt-1 text-neutral-400">Manage admin users and roles</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-lime-300 transition-all"
                    >
                        + Add User
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-lime-400/50"
                />

                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">User</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Role</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Created</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Last Login</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400/20 text-lime-400 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-white">{user.name}</p>
                                                        {user.id === currentUser?.id && (
                                                            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">You</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-neutral-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleColors[user.role]}`}>
                                                {roleLabels[user.role]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-neutral-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-neutral-400">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setEditUser(user as any)} className="text-lime-400 hover:underline text-sm">Edit</button>
                                                <button onClick={() => setResetPasswordUser(user as any)} className="text-blue-400 hover:underline text-sm">Reset PW</button>
                                                {user.id !== currentUser?.id && (
                                                    <button onClick={() => deleteUser(user.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-50">Previous</button>
                        <span className="text-sm text-neutral-400">Page {page} of {totalPages}</span>
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-50">Next</button>
                    </div>
                )}
            </div>

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
        if (!user && !password) { alert("Password is required for new users"); return; }
        onSave({ name, email, password: password || undefined, role }, !!user);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6">
                <h2 className="mb-6 text-xl font-bold text-white">{user ? "Edit User" : "Add User"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-400/50" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!!user} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-400/50 disabled:opacity-50" />
                    </div>
                    {!user && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-300">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-400/50" />
                        </div>
                    )}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                            <option value="super_admin" className="bg-neutral-900">Super Admin</option>
                            <option value="admin" className="bg-neutral-900">Admin</option>
                            <option value="content_writer" className="bg-neutral-900">Content Writer</option>
                            <option value="enquiry_handler" className="bg-neutral-900">Enquiry Handler</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 rounded-full border border-white/10 py-3 font-medium text-white hover:bg-white/5">Cancel</button>
                        <button type="submit" className="flex-1 rounded-full bg-lime-400 py-3 font-bold text-black hover:bg-lime-300">{user ? "Update" : "Create"}</button>
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
        if (newPassword.length < 6) { alert("Password must be at least 6 characters"); return; }
        onReset(newPassword);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6">
                <h2 className="mb-2 text-xl font-bold text-white">Reset Password</h2>
                <p className="mb-6 text-sm text-neutral-400">For: {user.email}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min 6 characters" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-400/50" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 rounded-full border border-white/10 py-3 font-medium text-white hover:bg-white/5">Cancel</button>
                        <button type="submit" className="flex-1 rounded-full bg-lime-400 py-3 font-bold text-black hover:bg-lime-300">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
