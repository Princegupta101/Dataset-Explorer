import React from 'react';
import { Database, FolderTree, MapPin, Calendar, FileText } from 'lucide-react';
import { IPlatformStats } from '../types/dataset';

interface StatsBarProps {
  stats: Partial<IPlatformStats>;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const minYear = stats.years && stats.years.length > 0 ? Math.min(...stats.years) : 2022;
  const maxYear = stats.years && stats.years.length > 0 ? Math.max(...stats.years) : 2024;

  const items = [
    {
      icon: <Database size={20} color="#6366f1" />,
      bg: 'rgba(99, 102, 241, 0.12)',
      label: 'Datasets',
      value: stats.totalDatasets ?? 20,
    },
    {
      icon: <FolderTree size={20} color="#a855f7" />,
      bg: 'rgba(168, 85, 247, 0.12)',
      label: 'Categories',
      value: stats.categoriesCount ?? 5,
    },
    {
      icon: <MapPin size={20} color="#10b981" />,
      bg: 'rgba(16, 185, 129, 0.12)',
      label: 'Geographies',
      value: stats.geographies?.length ?? 5,
    },
    {
      icon: <Calendar size={20} color="#38bdf8" />,
      bg: 'rgba(56, 189, 248, 0.12)',
      label: 'Active Years',
      value: `${minYear} - ${maxYear}`,
    },
    {
      icon: <FileText size={20} color="#f59e0b" />,
      bg: 'rgba(245, 158, 11, 0.12)',
      label: 'Observed Records',
      value: stats.totalRecords ? stats.totalRecords.toLocaleString() : '2.4M+',
    },
  ];

  return (
    <div className="stats-grid">
      {items.map((item, idx) => (
        <div key={idx} className="stat-card glass-panel">
          <div className="stat-icon-wrapper" style={{ background: item.bg }}>
            {item.icon}
          </div>
          <div>
            <div className="stat-number">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default StatsBar;
