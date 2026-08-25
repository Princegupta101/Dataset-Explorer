export type CategoryType = 'Demographics' | 'Healthcare' | 'Education' | 'Housing' | 'Economics';

export type GeographyType = 'National' | 'State' | 'County' | 'Metro' | 'City';

export interface IDataset {
  _id: string;
  name: string;
  category: CategoryType;
  description: string;
  source: string;
  geography: GeographyType | string;
  year: number;
  tags?: string[];
  recordsCount?: number;
  sampleAttributes?: string[];
  updateFrequency?: string;
  accessType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IDatasetResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: IPagination;
  filtersApplied: {
    search: string | null;
    category: string | null;
    geography: string | null;
    year: string | null;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  data: IDataset[];
}

export interface ICategoryStat {
  name: string;
  count: number;
  sourcesCount: number;
}

export interface IPlatformStats {
  totalDatasets: number;
  totalRecords: number;
  categoriesCount: number;
  sourcesCount: number;
  categories: string[];
  geographies: string[];
  years: number[];
}

export interface IAISummary {
  datasetId: string;
  datasetName: string;
  category: CategoryType;
  year: number;
  generatedAt: string;
  executiveSummary: string;
  domainAnalysis: string;
  targetStakeholders: string;
  keyTakeaways: string[];
  suggestedAnalyticalQuestions: string[];
  dataReliabilityScore: string;
}
