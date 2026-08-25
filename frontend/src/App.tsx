import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import DatasetCard from './components/DatasetCard';
import DatasetTable from './components/DatasetTable';
import DatasetDetailModal from './components/DatasetDetailModal';
import AISummaryModal from './components/AISummaryModal';
import Pagination from './components/Pagination';
import EmptyState from './components/EmptyState';
import ErrorBanner from './components/ErrorBanner';
import SkeletonLoader from './components/SkeletonLoader';
import { api } from './services/api';
import { IDataset, IPagination, IPlatformStats, IAISummary, ICategoryStat } from './types/dataset';
import { X } from 'lucide-react';

export const App: React.FC = () => {
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<Partial<IPlatformStats>>({});
  const [categories, setCategories] = useState<ICategoryStat[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [geography, setGeography] = useState('All');
  const [year, setYear] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1, totalPages: 1, limit: 6, hasNextPage: false, hasPrevPage: false,
  });
  const [totalCount, setTotalCount] = useState(0);

  const [selectedDataset, setSelectedDataset] = useState<IDataset | null>(null);
  const [aiSummary, setAiSummary] = useState<IAISummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c] = await Promise.allSettled([api.getStats(), api.getCategories()]);
        if (s.status === 'fulfilled' && s.value.success) setStats(s.value.data);
        if (c.status === 'fulfilled' && c.value.success) setCategories(c.value.data);
      } catch {}
    };
    load();
  }, []);

  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    let total = 0;
    categories.forEach((c) => { m[c.name] = c.count; total += c.count; });
    m['All'] = total || stats.totalDatasets || 20;
    return m;
  }, [categories, stats]);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDatasets({
        q: searchTerm.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        geography: geography !== 'All' ? geography : undefined,
        year: year !== 'All' ? year : undefined,
        sortBy, sortOrder,
        page: pagination.currentPage,
        limit: pagination.limit,
      });
      if (res.success) {
        setDatasets(res.data);
        setPagination(res.pagination);
        setTotalCount(res.total);
      } else throw new Error('Failed');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch datasets.');
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, geography, year, sortBy, sortOrder, pagination.currentPage, pagination.limit]);

  useEffect(() => {
    const t = setTimeout(fetchDatasets, 250);
    return () => clearTimeout(t);
  }, [fetchDatasets]);

  const resetPage = () => setPagination((p) => ({ ...p, currentPage: 1 }));
  const handleSearch = (v: string) => { setSearchTerm(v); resetPage(); };
  const handleCategory = (v: string) => { setCategory(v); resetPage(); };
  const handleGeo = (v: string) => { setGeography(v); resetPage(); };
  const handleYear = (v: string) => { setYear(v); resetPage(); };
  const handleSort = (sb: string, so: 'asc' | 'desc') => { setSortBy(sb); setSortOrder(so); resetPage(); };
  const handlePage = (p: number) => { setPagination((prev) => ({ ...prev, currentPage: p })); window.scrollTo({ top: 200, behavior: 'smooth' }); };
  const handleLimit = (l: number) => setPagination((p) => ({ ...p, limit: l, currentPage: 1 }));

  const handleClear = () => {
    setSearchTerm(''); setCategory('All'); setGeography('All'); setYear('All');
    setSortBy('name'); setSortOrder('asc'); resetPage();
  };

  const handleSummarize = async (ds: IDataset) => {
    setAiLoading(true); setAiSummary(null);
    try {
      const res = await api.summarizeDataset(ds._id);
      if (res.success) setAiSummary(res.data);
    } catch {} finally { setAiLoading(false); }
  };

  const hasFilters = searchTerm || category !== 'All' || geography !== 'All' || year !== 'All';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar totalDatasets={stats.totalDatasets || totalCount || 20} isLive={!error} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pb-20">
        <HeroSection />

        <FilterBar
          searchTerm={searchTerm} onSearchChange={handleSearch}
          category={category} onCategoryChange={handleCategory}
          geography={geography} onGeographyChange={handleGeo}
          year={year} onYearChange={handleYear}
          sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSort}
          viewMode={viewMode} onViewModeChange={setViewMode}
          categoryCounts={categoryCounts}
        />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-xs">
          <span className="text-stone-600">
            <strong className="text-stone-900 font-semibold">{totalCount}</strong> dataset{totalCount !== 1 ? 's' : ''}
            {category !== 'All' && <> in <span className="font-medium text-stone-800">{category}</span></>}
            {geography !== 'All' && <> · {geography}</>}
            {year !== 'All' && <> · {year}</>}
          </span>
          {hasFilters && (
            <button
              className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
              onClick={handleClear}
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <SkeletonLoader count={pagination.limit} viewMode={viewMode} />
        ) : error ? (
          <ErrorBanner message={error} onRetry={fetchDatasets} />
        ) : datasets.length === 0 ? (
          <EmptyState query={searchTerm} onClearFilters={handleClear} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {datasets.map((d) => <DatasetCard key={d._id} dataset={d} onSelect={setSelectedDataset} />)}
          </div>
        ) : (
          <DatasetTable datasets={datasets} onSelect={setSelectedDataset} />
        )}

        {!loading && !error && datasets.length > 0 && (
          <Pagination pagination={pagination} total={totalCount} onPageChange={handlePage} onLimitChange={handleLimit} />
        )}
      </main>

      <DatasetDetailModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} onSummarize={handleSummarize} />
      <AISummaryModal summary={aiSummary} loading={aiLoading} onClose={() => { setAiSummary(null); setAiLoading(false); }} />

      <footer className="py-6 border-t border-stone-200 text-center text-xs text-stone-400 bg-white">
        StatsUSA Dataset Explorer · Built with React, Tailwind CSS, Express & MongoDB
      </footer>
    </div>
  );
};
export default App;
