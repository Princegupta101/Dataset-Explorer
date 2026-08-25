import React from 'react';
import { BarChart3 } from 'lucide-react';

interface NavbarProps {
  totalDatasets?: number;
  isLive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ totalDatasets = 20, isLive = true }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
        <div className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight text-stone-900">
          <div className="w-7 h-7 rounded-md bg-stone-800 flex items-center justify-center">
            <BarChart3 size={16} className="text-white" />
          </div>
          <span>StatsUSA</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-stone-600 font-medium">{totalDatasets} datasets</span>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Connected
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
