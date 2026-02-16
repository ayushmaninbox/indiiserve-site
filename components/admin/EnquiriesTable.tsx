'use client';

import { useState } from 'react';

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

interface EnquiriesTableProps {
  enquiries: Enquiry[];
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: 'pending' | 'solved') => void;
  onBatchDelete: (ids: string[]) => void;
  onBatchStatusUpdate: (ids: string[], status: 'pending' | 'solved') => void;
  onRowClick?: (enquiry: Enquiry) => void;
}

export default function EnquiriesTable({
  enquiries,
  onDelete,
  onStatusUpdate,
  onBatchDelete,
  onBatchStatusUpdate,
  onRowClick
}: EnquiriesTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === enquiries.length && enquiries.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(enquiries.map(e => e.id)));
    }
  };

  const handleStatusClick = (enquiry: Enquiry) => {
    if (enquiry.status === 'solved') {
      if (confirm('Mark this enquiry as pending?')) {
        onStatusUpdate(enquiry.id, 'pending');
      }
    } else {
      if (confirm('Has this enquiry been successfully solved?')) {
        onStatusUpdate(enquiry.id, 'solved');
      }
    }
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to PERMANENTLY delete these ${selectedIds.size} enquiries?`)) {
      onBatchDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleBatchMarkSolved = () => {
    if (confirm(`Mark ${selectedIds.size} selected enquiries as SOLVED?`)) {
      onBatchStatusUpdate(Array.from(selectedIds), 'solved');
      setSelectedIds(new Set());
    }
  };

    return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700">
      {/* Selection Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 px-6 py-4 rounded-[2rem] flex items-center justify-between animate-in slide-in-from-top-4 duration-500 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-white uppercase tracking-[0.3em]">{selectedIds.size} selected</span>
            </div>

            <div className="h-6 w-px bg-white/10"></div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBatchMarkSolved}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                Mark Solved
              </button>

              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-2 px-5 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-[10px] font-semibold uppercase tracking-[0.2em] transition-all shadow-lg shadow-red-500/10 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>

          <button
            className="text-[9px] font-semibold text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear Selection
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.03] border-b border-white/5">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === enquiries.length && enquiries.length > 0}
                      onChange={toggleAll}
                      className="rounded border-slate-600 bg-white/[0.05] text-violet-500 focus:ring-violet-500/30 h-4 w-4 cursor-pointer transition-all border-none"
                    />
                  </div>
                </th>
                <th className="w-16 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Name / Company</th>
                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Message</th>
                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Date / Time</th>
                <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 text-slate-600">
                      <div className="h-20 w-20 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5">
                        <span className="text-4xl filter grayscale">📭</span>
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.4em]">No enquiries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    onClick={() => onRowClick?.(enquiry)}
                    className={`group transition-all hover:bg-white/[0.03] cursor-pointer relative overflow-hidden ${selectedIds.has(enquiry.id) ? 'bg-violet-500/5' : ''}`}
                  >
                    <td className="px-6 py-2.5" onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={selectedIds.has(enquiry.id)}
                            onChange={() => toggleSelection(enquiry.id)}
                            className="rounded-md border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500/20 h-5 w-5 cursor-pointer transition-all border-none"
                        />
                       </div>
                    </td>
                    <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStatusClick(enquiry)}
                        className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all shadow-xl ${enquiry.status === 'solved'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
                          : 'bg-white/5 border-white/10 text-transparent hover:border-violet-500/40 hover:bg-violet-500/5'
                          }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex flex-col">
                        <span className={`text-base font-semibold tracking-tight transition-all ${enquiry.status === 'solved' ? 'text-slate-500 line-through opacity-50' : 'text-white'}`}>
                          {enquiry.name}
                        </span>
                        <span className="text-[9px] font-semibold text-violet-400/60 uppercase tracking-[0.4em] mt-1.5">{enquiry.company || 'Individual'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      <p className="max-w-[300px] truncate text-xs font-bold text-slate-400 italic" title={enquiry.message}>
                        "{enquiry.message || '-'}"
                      </p>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-400 tabular-nums">
                        {new Date(enquiry.submittedAt).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest mt-1">
                            {new Date(enquiry.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <a
                          href={`https://wa.me/${enquiry.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 hover:border-green-500/30 transition-all"
                          title="WhatsApp"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </a>
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Call"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </a>
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Email"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </a>
                        <button
                          onClick={() => onDelete(enquiry.id)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
