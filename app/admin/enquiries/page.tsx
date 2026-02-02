"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/admin/AuthGuard";

interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    status: "pending" | "solved";
    submittedAt: string;
}

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "solved">("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [detailEnquiry, setDetailEnquiry] = useState<Enquiry | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        try {
            const res = await fetch("/api/enquiries");
            const data = await res.json();
            setEnquiries(data);
        } catch (error) {
            console.error("Failed to load enquiries:", error);
        }
    };

    const filtered = enquiries
        .filter((e) => (statusFilter === "all" ? true : e.status === statusFilter))
        .filter((e) =>
            search
                ? e.name.toLowerCase().includes(search.toLowerCase()) ||
                e.email.toLowerCase().includes(search.toLowerCase())
                : true
        )
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const paginatedData = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === paginatedData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedData.map((e) => e.id));
        }
    };

    const updateStatus = async (ids: string[], status: "pending" | "solved") => {
        try {
            await Promise.all(
                ids.map((id) =>
                    fetch(`/api/enquiries/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status }),
                    })
                )
            );
            await loadEnquiries();
            setSelectedIds([]);
        } catch (error) {
            console.error("Failed to update:", error);
        }
    };

    const deleteEnquiries = async (ids: string[]) => {
        if (!confirm(`Delete ${ids.length} enquiry(s)?`)) return;
        try {
            await Promise.all(
                ids.map((id) => fetch(`/api/enquiries/${id}`, { method: "DELETE" }))
            );
            await loadEnquiries();
            setSelectedIds([]);
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const exportCSV = () => {
        const headers = ["Name", "Email", "Phone", "Company", "Message", "Status", "Date"];
        const rows = filtered.map((e) => [
            e.name,
            e.email,
            e.phone,
            e.company,
            e.message.replace(/,/g, ";"),
            e.status,
            new Date(e.submittedAt).toLocaleDateString(),
        ]);
        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "enquiries.csv";
        a.click();
    };

    const pendingCount = enquiries.filter((e) => e.status === "pending").length;
    const solvedCount = enquiries.filter((e) => e.status === "solved").length;

    return (
        <AuthGuard requiredPermission="enquiries">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Enquiries</h1>
                        <p className="mt-1 text-neutral-400">
                            {enquiries.length} total • {pendingCount} pending • {solvedCount} solved
                        </p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5"
                    >
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-lime-400/50"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "solved")}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none"
                    >
                        <option value="all" className="bg-neutral-900">All Status</option>
                        <option value="pending" className="bg-neutral-900">Pending</option>
                        <option value="solved" className="bg-neutral-900">Solved</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-lime-400/30 bg-lime-400/10 p-3">
                        <span className="text-sm text-lime-400">{selectedIds.length} selected</span>
                        <button
                            onClick={() => updateStatus(selectedIds, "pending")}
                            className="rounded-lg bg-orange-500/20 px-3 py-1.5 text-sm text-orange-400 hover:bg-orange-500/30"
                        >
                            Mark Pending
                        </button>
                        <button
                            onClick={() => updateStatus(selectedIds, "solved")}
                            className="rounded-lg bg-green-500/20 px-3 py-1.5 text-sm text-green-400 hover:bg-green-500/30"
                        >
                            Mark Solved
                        </button>
                        <button
                            onClick={() => deleteEnquiries(selectedIds)}
                            className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/30"
                        >
                            Delete
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                                            onChange={selectAll}
                                            className="rounded"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Contact</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((enquiry) => (
                                    <tr
                                        key={enquiry.id}
                                        onClick={() => setDetailEnquiry(enquiry)}
                                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                                    >
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(enquiry.id)}
                                                onChange={() => toggleSelect(enquiry.id)}
                                                className="rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-white">{enquiry.name}</p>
                                            <p className="text-sm text-neutral-500">{enquiry.company}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-white">{enquiry.email}</p>
                                            <p className="text-sm text-neutral-500">{enquiry.phone}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${enquiry.status === "solved"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-orange-500/20 text-orange-400"
                                                    }`}
                                            >
                                                {enquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-neutral-400">
                                            {new Date(enquiry.submittedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-neutral-400">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {detailEnquiry && (
                <EnquiryDetailModal
                    enquiry={detailEnquiry}
                    onClose={() => setDetailEnquiry(null)}
                    onStatusChange={async (status) => {
                        await updateStatus([detailEnquiry.id], status);
                        setDetailEnquiry(null);
                    }}
                />
            )}
        </AuthGuard>
    );
}

function EnquiryDetailModal({
    enquiry,
    onClose,
    onStatusChange,
}: {
    enquiry: Enquiry;
    onClose: () => void;
    onStatusChange: (status: "pending" | "solved") => void;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-900 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">{enquiry.name}</h2>
                        <p className="text-sm text-neutral-400">{enquiry.company}</p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${enquiry.status === "solved"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-orange-500/20 text-orange-400"
                            }`}
                    >
                        {enquiry.status}
                    </span>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <p className="text-xs text-neutral-500 mb-1">Email</p>
                        <p className="text-white">{enquiry.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 mb-1">Phone</p>
                        <p className="text-white">{enquiry.phone}</p>
                    </div>
                    {enquiry.message && (
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Message</p>
                            <p className="text-neutral-300">{enquiry.message}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-neutral-500 mb-1">Submitted</p>
                        <p className="text-neutral-300">
                            {new Date(enquiry.submittedAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-2 mb-6">
                    <a
                        href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="flex-1 rounded-lg bg-green-500/20 py-2 text-center text-sm font-medium text-green-400 hover:bg-green-500/30"
                    >
                        WhatsApp
                    </a>
                    <a
                        href={`tel:${enquiry.phone}`}
                        className="flex-1 rounded-lg bg-blue-500/20 py-2 text-center text-sm font-medium text-blue-400 hover:bg-blue-500/30"
                    >
                        Call
                    </a>
                    <a
                        href={`mailto:${enquiry.email}`}
                        className="flex-1 rounded-lg bg-purple-500/20 py-2 text-center text-sm font-medium text-purple-400 hover:bg-purple-500/30"
                    >
                        Email
                    </a>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-full border border-white/10 py-3 font-medium text-white hover:bg-white/5"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onStatusChange(enquiry.status === "solved" ? "pending" : "solved")}
                        className="flex-1 rounded-full bg-lime-400 py-3 font-bold text-black hover:bg-lime-300"
                    >
                        Mark {enquiry.status === "solved" ? "Pending" : "Solved"}
                    </button>
                </div>
            </div>
        </div>
    );
}
