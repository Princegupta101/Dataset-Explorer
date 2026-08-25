import { IDataset, IDatasetResponse, IPlatformStats, IAISummary, ICategoryStat } from '../types/dataset';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface DatasetQueryParams {
  q?: string;
  category?: string;
  geography?: string;
  year?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(message) as Error & { status?: number; data?: any };
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data as T;
}

export const api = {
  async getDatasets(params: DatasetQueryParams = {}): Promise<IDatasetResponse> {
    const query = new URLSearchParams();

    if (params.q) query.append('q', params.q);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.geography && params.geography !== 'All') query.append('geography', params.geography);
    if (params.year && params.year !== 'All') query.append('year', String(params.year));
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));

    const qs = query.toString();
    const response = await fetch(`${API_BASE_URL}/datasets${qs ? `?${qs}` : ''}`);
    return handleResponse<IDatasetResponse>(response);
  },

  async searchDatasets(keyword: string, category?: string): Promise<{ success: boolean; count: number; total: number; query: string; data: IDataset[] }> {
    const query = new URLSearchParams();
    query.append('q', keyword);
    if (category && category !== 'All') query.append('category', category);

    const response = await fetch(`${API_BASE_URL}/datasets/search?${query.toString()}`);
    return handleResponse<{ success: boolean; count: number; total: number; query: string; data: IDataset[] }>(response);
  },

  async getDatasetById(id: string): Promise<{ success: boolean; data: IDataset }> {
    const response = await fetch(`${API_BASE_URL}/datasets/${id}`);
    return handleResponse<{ success: boolean; data: IDataset }>(response);
  },

  async getCategories(): Promise<{ success: boolean; count: number; data: ICategoryStat[] }> {
    const response = await fetch(`${API_BASE_URL}/datasets/categories`);
    return handleResponse<{ success: boolean; count: number; data: ICategoryStat[] }>(response);
  },

  async getStats(): Promise<{ success: boolean; data: IPlatformStats }> {
    const response = await fetch(`${API_BASE_URL}/datasets/stats`);
    return handleResponse<{ success: boolean; data: IPlatformStats }>(response);
  },

  async summarizeDataset(id: string): Promise<{ success: boolean; data: IAISummary }> {
    const response = await fetch(`${API_BASE_URL}/datasets/${id}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ success: boolean; data: IAISummary }>(response);
  },
};
