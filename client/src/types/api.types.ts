export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: unknown;
}
