import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  viewMode?: 'grid' | 'table';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6, viewMode = 'grid' }) => {
  if (viewMode === 'table') {
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
          <tbody className="divide-y divide-stone-100 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 px-4">
                  <div className="h-3.5 bg-stone-200 rounded w-48 mb-1.5"></div>
                  <div className="h-2.5 bg-stone-100 rounded w-72"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-5 bg-stone-100 rounded w-20"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-3 bg-stone-200 rounded w-28"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-3 bg-stone-200 rounded w-16"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-3 bg-stone-200 rounded w-10"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 h-60 flex flex-col justify-between animate-pulse">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-stone-200 rounded w-20"></div>
              <div className="h-3.5 bg-stone-100 rounded w-10"></div>
            </div>
            <div className="h-4 bg-stone-200 rounded w-4/5 mb-2"></div>
            <div className="h-3 bg-stone-100 rounded w-full mb-1.5"></div>
            <div className="h-3 bg-stone-100 rounded w-3/4"></div>
          </div>
          <div className="flex flex-col gap-2 pt-3 border-t border-stone-100">
            <div className="h-2.5 bg-stone-100 rounded w-full"></div>
            <div className="h-2.5 bg-stone-100 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SkeletonLoader;
