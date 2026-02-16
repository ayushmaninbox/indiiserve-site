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
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{selectedIds.size} nodes selected</span>
            </div>

            <div className="h-6 w-px bg-white/10"></div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBatchMarkSolved}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                Synchronize
              </button>

              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-2 px-5 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-red-500/10 active:scale-95"
              >
                Purge
              </button>
            </div>
          </div>

          <button
            className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
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
                <th className="w-12 px-8 py-6 text-left">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === enquiries.length && enquiries.length > 0}
                      onChange={toggleAll}
                      className="rounded-md border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500/20 h-5 w-5 cursor-pointer transition-all border-none"
                    />
                  </div>
                </th>
                <th className="w-16 px-4 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                  Status
                </th>
                <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Originator / Node</th>
                <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Message Payload</th>
                <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Log Timestamp</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Actions</th>
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
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Subspace is currently silent</p>
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
                    <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={selectedIds.has(enquiry.id)}
                            onChange={() => toggleSelection(enquiry.id)}
                            className="rounded-md border-white/10 bg-white/5 text-violet-600 focus:ring-violet-500/20 h-5 w-5 cursor-pointer transition-all border-none"
                        />
                       </div>
                    </td>
                    <td className="px-4 py-6" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStatusClick(enquiry)}
                        className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all shadow-xl ${enquiry.status === 'solved'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
                          : 'bg-white/5 border-white/10 text-transparent hover:border-violet-500/40 hover:bg-violet-500/5'
                          }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className={`text-base font-black tracking-tight transition-all ${enquiry.status === 'solved' ? 'text-slate-500 line-through opacity-50' : 'text-white'}`}>
                          {enquiry.name}
                        </span>
                        <span className="text-[9px] font-black text-violet-400/60 uppercase tracking-[0.4em] mt-1.5">{enquiry.company || 'Individual Node'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="max-w-[300px] truncate text-xs font-bold text-slate-400 italic" title={enquiry.message}>
                        "{enquiry.message || '-'}"
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-400 tabular-nums">
                        {new Date(enquiry.submittedAt).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                        </span>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
                            {new Date(enquiry.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <a
                          href={`https://wa.me/${enquiry.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                          title="Open Nexus Link"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.516-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.296-1.04 1.015-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                          </svg>
                        </a>
                        <button
                          onClick={() => onDelete(enquiry.id)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                          title="Purge Node"
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
