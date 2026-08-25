import React, { useEffect, useState } from 'react';
import { X, Building2, MapPin, Calendar, Hash, Sparkles, Copy, Check } from 'lucide-react';
import { IDataset } from '../types/dataset';

interface DatasetDetailModalProps {
  dataset: IDataset | null;
  onClose: () => void;
  onSummarize: (dataset: IDataset) => void;
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

export const DatasetDetailModal: React.FC<DatasetDetailModalProps> = ({ dataset, onClose, onSummarize }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!dataset) return null;

  const handleCopy = () => {
    const cite = `${dataset.name} (${dataset.year}). ${dataset.source}. Geography: ${dataset.geography}.`;
    navigator.clipboard.writeText(cite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryStyles(dataset.category)}`}>
                {dataset.category}
              </span>
              <span className="text-xs font-mono text-stone-400 font-medium">{dataset.year}</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 leading-snug">{dataset.name}</h2>
          </div>
          <button
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Description
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">{dataset.description}</p>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Details
            </div>
            <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-semibold text-stone-400">Source</span>
                <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5 truncate" title={dataset.source}>
                  <Building2 size={13} className="text-stone-500" /> {dataset.source}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-semibold text-stone-400">Geography</span>
                <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
                  <MapPin size={13} className="text-stone-500" /> {dataset.geography}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-semibold text-stone-400">Year</span>
                <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
                  <Calendar size={13} className="text-stone-500" /> {dataset.year}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-semibold text-stone-400">Records</span>
                <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
                  <Hash size={13} className="text-stone-500" /> {dataset.recordsCount ? dataset.recordsCount.toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {dataset.sampleAttributes && dataset.sampleAttributes.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Schema Fields
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dataset.sampleAttributes.map((a, i) => (
                  <span key={i} className="font-mono text-[11px] px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dataset.tags && dataset.tags.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dataset.tags.map((t, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-0.5 bg-stone-100 rounded-full text-stone-600">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy size={13} /> Copy citation
              </>
            )}
          </button>
          <button
            className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
            onClick={() => {
              onClose();
              onSummarize(dataset);
            }}
          >
            <Sparkles size={13} /> Summarize
          </button>
        </div>
      </div>
    </div>
  );
};
export default DatasetDetailModal;
