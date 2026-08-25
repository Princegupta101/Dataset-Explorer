import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ query, onClearFilters }) => (
  <div className="py-16 px-6 text-center flex flex-col items-center justify-center gap-3 bg-white border border-stone-200 rounded-xl">
    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
      <SearchX size={22} />
    </div>
    <h3 className="text-sm font-semibold text-stone-900">No datasets found</h3>
    <p className="text-xs text-stone-500 max-w-sm">
      {query ? `No results found for "${query}". Try searching other keywords or changing filters.` : 'No datasets match the current filter criteria.'}
    </p>
    <button
      className="mt-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
      onClick={onClearFilters}
    >
      <RotateCcw size={13} /> Reset filters
    </button>
  </div>
);
export default EmptyState;
