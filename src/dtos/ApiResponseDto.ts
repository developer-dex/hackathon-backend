export interface PaginationMeta {
  total: number;
  offset: number;
  limit: number;
}

export interface ApiResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
  pagination?: PaginationMeta;
} 