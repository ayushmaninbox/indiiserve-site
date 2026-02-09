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
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Enquiry Console</h1>
                        <p className="mt-1 text-sm font-medium text-zinc-500">
                            {enquiries.length} total • <span className="text-orange-600 font-bold">{pendingCount} pending</span> • <span className="text-emerald-600 font-bold">{solvedCount} solved</span>
                        </p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Records
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-6 rounded-[1.5rem] border border-zinc-200 shadow-sm">
                    <div className="flex flex-1 flex-wrap gap-4">
                        <div className="relative flex-1 min-w-[300px]">
                            <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-zinc-100 bg-zinc-50 pl-11 pr-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "solved")}
                            className="rounded-xl border border-zinc-100 bg-zinc-50 px-6 py-3 text-sm font-bold text-zinc-600 outline-none hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                            <option value="all">All Records</option>
                            <option value="pending">Pending Only</option>
                            <option value="solved">Solved Only</option>
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mr-2">{selectedIds.length} Selected</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateStatus(selectedIds, "pending")}
                                    className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-orange-700 hover:bg-orange-100 transition-colors shadow-sm"
                                >
                                    Reopen
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedIds, "solved")}
                                    className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm"
                                >
                                    Resolve
                                </button>
                                <button
                                    onClick={() => deleteEnquiries(selectedIds)}
                                    className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors shadow-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table Console */}
                <div className="rounded-[2rem] border border-zinc-200 bg-white overflow-hidden shadow-xl shadow-zinc-200/20">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                    <th className="px-6 py-5 text-left w-12">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                                                onChange={selectAll}
                                                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Customer Identity</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Contact Point</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Resolution Status</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Submission Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {paginatedData.map((enquiry) => (
                                    <tr
                                        key={enquiry.id}
                                        onClick={() => setDetailEnquiry(enquiry)}
                                        className="group hover:bg-indigo-50/30 cursor-pointer transition-all duration-300"
                                    >
                                        <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(enquiry.id)}
                                                    onChange={() => toggleSelect(enquiry.id)}
                                                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-bold text-zinc-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{enquiry.name}</p>
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{enquiry.company || "Individual"}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-semibold text-zinc-600">{enquiry.email}</p>
                                            <p className="text-[11px] font-medium text-zinc-400 mt-0.5">{enquiry.phone}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter border shadow-sm ${enquiry.status === "solved"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                        : "bg-orange-50 text-orange-700 border-orange-100"
                                                    }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${enquiry.status === "solved" ? "bg-emerald-500" : "bg-orange-500"}`} />
                                                {enquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                                {new Date(enquiry.submittedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-zinc-300">
                                                <svg className="w-20 h-20 mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                                <p className="font-black uppercase tracking-[0.3em] text-xs">Access Denied: No Records Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-6 pt-6">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Page</span>
                             <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-600/30">{page}</span>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">of {totalPages}</span>
                        </div>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Detailed View Modal */}
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
            <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm shadow-inner" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-[2.5rem] border border-zinc-200 bg-white p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex items-start justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">{enquiry.name}</h2>
                        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">{enquiry.company || "Private Inquiry"}</p>
                    </div>
                    <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border shadow-sm ${enquiry.status === "solved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                            }`}
                    >
                        <span className={`h-2 w-2 rounded-full ${enquiry.status === "solved" ? "bg-emerald-500" : "bg-orange-500"}`} />
                        {enquiry.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Digital Address</p>
                        <p className="text-sm font-bold text-zinc-700">{enquiry.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contact Identity</p>
                        <p className="text-sm font-bold text-zinc-700">{enquiry.phone}</p>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Core Message</p>
                        <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 text-sm font-medium leading-relaxed text-zinc-600 shadow-inner">
                            {enquiry.message || "No contextual message provided."}
                        </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                         <div className="h-[1px] flex-1 bg-zinc-100" />
                         <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">
                            Recorded: {new Date(enquiry.submittedAt).toLocaleString("en-US", { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </p>
                         <div className="h-[1px] flex-1 bg-zinc-100" />
                    </div>
                </div>

                {/* Direct Action Hub */}
                <div className="flex gap-3 mb-10">
                    <a
                        href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        WhatsApp
                    </a>
                    <a
                        href={`mailto:${enquiry.email}`}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
                    >
                        Signal Link
                    </a>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-full border border-zinc-200 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 transition-all"
                    >
                        Exit View
                    </button>
                    <button
                        onClick={() => onStatusChange(enquiry.status === "solved" ? "pending" : "solved")}
                        className={`flex-1 rounded-full py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 ${
                            enquiry.status === "solved" 
                            ? "bg-orange-600 shadow-orange-600/20 hover:bg-orange-700" 
                            : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                        }`}
                    >
                        {enquiry.status === "solved" ? "Reopen Case" : "Finalize Solution"}
                    </button>
                </div>
            </div>
        </div>
    );
}
