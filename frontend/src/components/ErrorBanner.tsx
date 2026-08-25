import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => (
  <div className="py-16 px-6 text-center flex flex-col items-center justify-center gap-3 bg-white border border-rose-200 rounded-xl">
    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
      <AlertTriangle size={22} />
    </div>
    <h3 className="text-sm font-semibold text-stone-900">Unable to load datasets</h3>
    <p className="text-xs text-stone-500 max-w-sm">{message || 'Something went wrong while connecting to the API.'}</p>
    <button
      className="mt-1 px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
      onClick={onRetry}
    >
      <RefreshCw size={13} /> Retry connection
    </button>
  </div>
);
export default ErrorBanner;
