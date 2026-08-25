import React from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { IDataset } from '../types/dataset';

interface DatasetCardProps {
  dataset: IDataset;
  onSelect: (dataset: IDataset) => void;
}

const getCategoryStyles = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'demographics':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'healthcare':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'education':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'housing':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'economics':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, onSelect }) => {
  const { name, category, description, source, geography, year, recordsCount } = dataset;

  return (
    <div
      className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between cursor-pointer hover:border-stone-400 hover:shadow-md transition-all group"
      onClick={() => onSelect(dataset)}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryStyles(category)}`}>
            {category}
          </span>
          <span className="text-xs font-mono text-stone-400 font-medium">{year}</span>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-stone-700">
          {name}
        </h3>

        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 pt-3 border-t border-stone-100 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-stone-400 flex items-center gap-1.5 text-[11px]">
            <Building2 size={12} /> Source
          </span>
          <span className="text-stone-600 font-medium truncate max-w-[170px]" title={source}>
            {source}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-stone-400 flex items-center gap-1.5 text-[11px]">
            <MapPin size={12} /> Geography
          </span>
          <span className="text-stone-600 font-medium">{geography}</span>
        </div>

        {recordsCount !== undefined && recordsCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px]">Records</span>
            <span className="text-stone-600 font-medium">{recordsCount.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default DatasetCard;
