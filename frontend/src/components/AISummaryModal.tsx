import React, { useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { IAISummary } from '../types/dataset';

interface AISummaryModalProps {
  summary: IAISummary | null;
  loading: boolean;
  onClose: () => void;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({ summary, loading, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!summary && !loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-200 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-700 flex items-center gap-1 mb-1">
              <Sparkles size={13} /> Dataset Summary
            </div>
            <h2 className="text-sm font-bold text-stone-900 leading-snug">
              {summary ? summary.datasetName : 'Generating summary...'}
            </h2>
          </div>
          <button
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {loading ? (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="text-stone-400 animate-spin" />
              <span className="text-xs text-stone-500">Analyzing dataset metrics...</span>
            </div>
          ) : summary ? (
            <>
              <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-900 mb-1">
                  Executive Overview
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{summary.executiveSummary}</p>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Key Takeaways
                </div>
                <ul className="text-xs text-stone-600 space-y-1 list-disc pl-4 leading-relaxed">
                  {summary.keyTakeaways.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                    Domain Focus
                  </div>
                  <p className="text-xs text-stone-700 leading-normal">{summary.domainAnalysis}</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                    Beneficiaries
                  </div>
                  <p className="text-xs text-stone-700 leading-normal">{summary.targetStakeholders}</p>
                </div>
              </div>

              {summary.suggestedAnalyticalQuestions.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Sample Research Questions
                  </div>
                  <div className="space-y-1.5">
                    {summary.suggestedAnalyticalQuestions.map((q, i) => (
                      <div key={i} className="text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            className="px-3.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default AISummaryModal;
