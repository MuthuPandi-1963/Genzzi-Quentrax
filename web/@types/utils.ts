
export interface PaginationMeta {
  page: number;
  pageSize: number; 
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ── API response envelope ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Sort / Filter helpers ────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc';

export interface SortParam {
  field: string;
  order: SortOrder;
}

// ── Soft-delete filter ───────────────────────────────────────────────────────

export interface WithSoftDelete {
  /** When true, includes soft-deleted records in queries */
  includeDeleted?: boolean;
}

// ── ID-only selects ──────────────────────────────────────────────────────────

export interface IdObject {
  id: string;
}

/** Use when you only need IDs for a connect/disconnect operation */
export type ConnectById = { id: string };

// ── Date range filter ────────────────────────────────────────────────────────

export interface DateRangeFilter {
  from?: Date | string;
  to?: Date | string;
}
