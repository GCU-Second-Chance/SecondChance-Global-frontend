/**
 * API Response Types
 */

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API Error Class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(response: Response, data?: unknown): ApiError {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String(data.error)
        : response.statusText || "An error occurred";

    return new ApiError(response.status, message, data);
  }
}

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network connection failed. Please check your internet.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Invalid data provided.",
  SERVER_ERROR: "Server error. Please try again later.",
} as const;
