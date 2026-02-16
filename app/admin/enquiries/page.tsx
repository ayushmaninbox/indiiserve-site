"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/admin/AuthGuard";
import StatsCard from "@/components/admin/StatsCard";
import PaginationControls from "@/components/admin/PaginationControls";
import EnquiriesTable from "@/components/admin/EnquiriesTable";

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

// SVG Icons from Marble Site
const InboxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "solved">("all");
    const [detailEnquiry, setDetailEnquiry] = useState<Enquiry | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/enquiries");
            const data = await res.json();
            setEnquiries(data);
        } catch (error) {
            console.error("Failed to load enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = enquiries
        .filter((e) => (statusFilter === "all" ? true : e.status === statusFilter))
        .filter((e) =>
            search
                ? e.name.toLowerCase().includes(search.toLowerCase()) ||
                e.email.toLowerCase().includes(search.toLowerCase()) ||
                e.company.toLowerCase().includes(search.toLowerCase())
                : true
        )
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const totalItems = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = filtered.slice(startIndex, endIndex);

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
            (window as any).showToast?.(`Updated status to ${status}`, "success");
        } catch (error) {
            console.error("Failed to update:", error);
            (window as any).showToast?.("Failed to update status", "error");
        }
    };

    const deleteEnquiries = async (ids: string[]) => {
        try {
            await Promise.all(
                ids.map((id) => fetch(`/api/enquiries/${id}`, { method: "DELETE" }))
            );
            await loadEnquiries();
            (window as any).showToast?.(`Deleted ${ids.length} record(s)`, "success");
        } catch (error) {
            console.error("Failed to delete:", error);
            (window as any).showToast?.("Failed to delete records", "error");
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

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <AuthGuard requiredPermission="enquiries">
            <div className="space-y-10 animate-in fade-in duration-700 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold text-white tracking-tight">Intel Matrix</h1>
                        <p className="mt-1 text-[10px] font-semibold text-violet-400/60 uppercase tracking-[0.4em]">Inbound Telemetry & CRM Node</p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 transition-all hover:bg-white/5 hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Archive
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard 
                        title="Total Streams" 
                        value={enquiries.length} 
                        icon={<InboxIcon />} 
                        iconBgColor="bg-violet-500/10"
                        iconColor="text-violet-400"
                    />
                    <StatsCard 
                        title="Synchronized" 
                        value={solvedCount} 
                        icon={<CheckCircleIcon />} 
                        iconBgColor="bg-emerald-500/10"
                        iconColor="text-emerald-400"
                    />
                    <StatsCard 
                        title="Pending Intel" 
                        value={pendingCount} 
                        icon={<ClockIcon />} 
                        iconBgColor="bg-amber-500/10"
                        iconColor="text-amber-400"
                    />
                </div>

                {/* Toolbar */}
                <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-4 backdrop-blur-3xl shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h3 className="text-[10px] font-semibold text-white uppercase tracking-[0.4em] flex items-center gap-3 px-4">
                           <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" /> Record Console
                        </h3>
                        <div className="flex flex-1 max-w-2xl gap-4">
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    placeholder="Search by originator or node source..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-sm font-bold text-white focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/40 transition-all placeholder:text-slate-600 selection:bg-violet-500/30"
                                />
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors">
                                    <SearchIcon />
                                </div>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="px-6 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-[10px] font-semibold text-slate-400 focus:outline-none focus:border-violet-500/40 cursor-pointer transition-all uppercase tracking-widest"
                            >
                                <option value="all">Global Status</option>
                                <option value="pending">Pending Intel</option>
                                <option value="solved">Synchronized</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Telemetry Sequence: {startIndex + 1}-{endIndex} of {totalItems}</p>
                    <PaginationControls
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemName="enquiries"
                    />
                </div>

                <EnquiriesTable
                    enquiries={paginatedData}
                    onDelete={(id) => deleteEnquiries([id])}
                    onStatusUpdate={(id, status) => updateStatus([id], status)}
                    onBatchDelete={deleteEnquiries}
                    onBatchStatusUpdate={updateStatus}
                    onRowClick={(enquiry) => setDetailEnquiry(enquiry)}
                />

                <div className="pt-6 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.02] border border-white/5">
                        <div className="h-1 w-1 rounded-full bg-violet-500 animate-pulse" />
                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Central Telemetry Synchronized</p>
                    </div>
                </div>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 bg-[#030014]/90 backdrop-blur-2xl" onClick={onClose} />
            <div className="relative w-full max-w-xl rounded-[3rem] border border-white/5 bg-[#030014] p-10 shadow-2xl animate-in fade-in zoom-in duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <div className="flex items-start justify-between mb-10 relative z-10">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-white uppercase">{enquiry.name}</h2>
                        <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-[0.4em] mt-2">{enquiry.company || "Individual Operator"}</p>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 rounded-2xl border border-white/5 bg-white/[0.03] text-slate-500 flex items-center justify-center hover:bg-white/5 hover:text-white transition-all shadow-xl">
                        <CloseIcon />
                    </button>
                </div>

                <div className="space-y-10 mb-10 relative z-10">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Source Address</p>
                            <p className="text-sm font-bold text-white tracking-tight break-all">{enquiry.email}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Signal ID</p>
                            <p className="text-sm font-bold text-white tracking-tight tabular-nums">{enquiry.phone}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Narrative Fragment</p>
                        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 text-sm font-medium leading-[1.8] text-slate-300 shadow-inner">
                            "{enquiry.message || "No contextual metadata provided for this signal."}"
                        </div>
                    </div>

                    <div className="pt-4 text-center border-t border-white/5">
                        <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-[0.4em]">
                            Logged via gateway on {new Date(enquiry.submittedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Direct Action Hub */}
                <div className="flex gap-4 mb-6 relative z-10">
                    <a
                        href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 py-4.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Nexus Link
                    </a>
                    <a
                        href={`mailto:${enquiry.email}`}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] py-4.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-[0.98] shadow-xl"
                    >
                        Direct Transmit
                    </a>
                </div>

                <button
                    onClick={() => onStatusChange(enquiry.status === "solved" ? "pending" : "solved")}
                    className={`w-full rounded-2xl py-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white shadow-2xl transition-all active:scale-[0.95] relative z-10 ${enquiry.status === "solved"
                        ? "bg-amber-500/80 shadow-amber-500/20 hover:bg-amber-500"
                        : "bg-gradient-to-r from-indigo-500 to-violet-600 shadow-violet-500/20 hover:scale-[1.02]"
                        }`}
                >
                    {enquiry.status === "solved" ? "Reopen Signal Sequence" : "Synchronize Intel"}
                </button>
            </div>
        </div>
    );
}
