import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IPagination } from '../types/dataset';

interface PaginationProps {
  pagination: IPagination;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, total, onPageChange, onLimitChange }) => {
  const { currentPage, totalPages, limit, hasPrevPage, hasNextPage } = pagination;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  const pages = () => {
    const p: number[] = [];
    const max = 5;
    let s = Math.max(1, currentPage - Math.floor(max / 2));
    let e = Math.min(totalPages, s + max - 1);
    if (e - s + 1 < max) s = Math.max(1, e - max + 1);
    for (let i = s; i <= e; i++) p.push(i);
    return p;
  };

  if (totalPages <= 1 && total <= limit) return null;

  return (
    <div className="flex items-center justify-between py-4 flex-wrap gap-3 text-xs">
      <div className="text-stone-500">
        <span className="font-semibold text-stone-900">{start}–{end}</span> of{' '}
        <span className="font-semibold text-stone-900">{total}</span> datasets
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-stone-500">
          <span>Per page</span>
          <select
            className="py-1 px-2 bg-white border border-stone-200 rounded-md text-stone-800 text-xs focus:outline-none focus:border-stone-800"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-stone-50 transition-colors"
            disabled={!hasPrevPage}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>

          {pages().map((p) => (
            <button
              key={p}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                p === currentPage
                  ? 'bg-stone-900 text-white border border-stone-900'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-stone-50 transition-colors"
            disabled={!hasNextPage}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Pagination;
