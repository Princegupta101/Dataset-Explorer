import React from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Demographics', label: 'Demographics' },
  { id: 'Healthcare', label: 'Healthcare' },
  { id: 'Education', label: 'Education' },
  { id: 'Housing', label: 'Housing' },
  { id: 'Economics', label: 'Economics' },
];

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  geography: string;
  onGeographyChange: (geo: string) => void;
  year: string;
  onYearChange: (year: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  categoryCounts?: Record<string, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  geography,
  onGeographyChange,
  year,
  onYearChange,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  categoryCounts = {},
}) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6 flex flex-col gap-3 shadow-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[220px] relative flex items-center">
          <Search size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:border-stone-800 transition-colors"
            placeholder="Search by name, source, or keyword..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2.5 text-stone-400 hover:text-stone-700 p-0.5"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs cursor-pointer focus:outline-none focus:border-stone-800"
          value={geography}
          onChange={(e) => onGeographyChange(e.target.value)}
        >
          <option value="All">All geographies</option>
          <option value="National">National</option>
          <option value="State">State</option>
          <option value="County">County</option>
          <option value="Metro">Metro</option>
          <option value="City">City</option>
        </select>

        <select
          className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs cursor-pointer focus:outline-none focus:border-stone-800"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
        >
          <option value="All">All years</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>

        <select
          className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs cursor-pointer focus:outline-none focus:border-stone-800"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split('-');
            onSortChange(s, o as 'asc' | 'desc');
          }}
        >
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="year-desc">Newest first</option>
          <option value="year-asc">Oldest first</option>
        </select>

        <div className="flex border border-stone-200 rounded-lg overflow-hidden">
          <button
            className={`p-2 flex items-center justify-center transition-colors ${
              viewMode === 'grid' ? 'bg-stone-800 text-white' : 'bg-white text-stone-400 hover:bg-stone-50'
            }`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            className={`p-2 flex items-center justify-center border-l border-stone-200 transition-colors ${
              viewMode === 'table' ? 'bg-stone-800 text-white' : 'bg-white text-stone-400 hover:bg-stone-50'
            }`}
            onClick={() => onViewModeChange('table')}
            aria-label="Table view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-stone-900 text-white'
                  : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
              {categoryCounts[cat.id] !== undefined && (
                <span className="ml-1 opacity-60 text-[11px] font-normal">
                  {categoryCounts[cat.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default FilterBar;
