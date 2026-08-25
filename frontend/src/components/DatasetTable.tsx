import React from 'react';
import { IDataset } from '../types/dataset';

interface DatasetTableProps {
  datasets: IDataset[];
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

export const DatasetTable: React.FC<DatasetTableProps> = ({ datasets, onSelect }) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto mb-8 shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-2.5 px-4">Name</th>
            <th className="py-2.5 px-4">Category</th>
            <th className="py-2.5 px-4">Source</th>
            <th className="py-2.5 px-4">Geography</th>
            <th className="py-2.5 px-4">Year</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {datasets.map((d) => (
            <tr
              key={d._id}
              onClick={() => onSelect(d)}
              className="hover:bg-stone-50/70 transition-colors cursor-pointer"
            >
              <td className="py-3 px-4">
                <div className="font-semibold text-stone-900">{d.name}</div>
                <div className="text-stone-500 max-w-xs truncate text-[11px] mt-0.5">{d.description}</div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryStyles(d.category)}`}>
                  {d.category}
                </span>
              </td>
              <td className="py-3 px-4 text-stone-600 max-w-[180px] truncate" title={d.source}>
                {d.source}
              </td>
              <td className="py-3 px-4 text-stone-700 whitespace-nowrap">{d.geography}</td>
              <td className="py-3 px-4 font-mono text-stone-400 whitespace-nowrap">{d.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DatasetTable;
