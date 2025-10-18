/**
 * API Error Types
 * Standardized error handling for API requests
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  data?: unknown;
}
