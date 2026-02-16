import { ReactNode } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemName?: string; // e.g. "products"
}

export default function PaginationControls({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange,
  itemName = 'items'
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-10 py-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          <span className="opacity-60 italic">Displaying Sequence</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-white">
            <span>{totalItems > 0 ? startIndex + 1 : 0}</span>
            <span className="opacity-30">/</span>
            <span>{endIndex}</span>
          </div>
          <span className="opacity-60 italic">from</span>
          <span className="text-violet-400 font-black">{totalItems}</span>
          <span className="opacity-60 italic">{itemName}</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hidden sm:inline italic">Node Density:</label>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => { onItemsPerPageChange(Number(e.target.value)); onPageChange(1); }}
                className="appearance-none rounded-xl border border-white/5 bg-white/[0.03] pl-4 pr-10 py-2.5 text-[10px] font-black text-white outline-none focus:border-violet-500/40 transition-all cursor-pointer uppercase tracking-widest"
              >
                {[5, 10, 20, 50, 100].map(val => (
                  <option key={val} value={val} className="bg-[#030014]">{val}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m19 9-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-white/5"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 disabled:opacity-5 hover:bg-white/5 hover:text-white transition-all shadow-xl"
            >
              Previous
            </button>
            <div className="px-6 py-2.5 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-center min-w-[100px]">
                <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase italic">
                    {currentPage} <span className="opacity-20 mx-1">::</span> {totalPages || 1}
                </span>
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 disabled:opacity-5 hover:bg-white/5 hover:text-white transition-all shadow-xl"
            >
              Next
            </button>
          </div>
        </div>
      </div>
  );
}
