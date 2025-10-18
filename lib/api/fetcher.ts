/**
 * API Fetcher Utility
 * Centralized fetch wrapper with error handling and timeout support
 */

import { ApiError } from "./errors";

export interface FetcherOptions extends RequestInit {
  timeout?: number; // Timeout in milliseconds
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Generic fetcher function for API requests
 * @param url - API endpoint URL
 * @param options - Fetch options with optional timeout
 * @returns Promise with parsed JSON response
 * @throws ApiError on failure
 */
export async function fetcher<T = unknown>(url: string, options: FetcherOptions = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData
      );
    }

    // Parse and return JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }

    // Handle network errors
    if (error instanceof Error && !("statusCode" in error)) {
      throw new ApiError(error.message, 0);
    }

    // Re-throw ApiError
    throw error;
  }
}

/**
 * GET request helper
 */
export async function get<T = unknown>(url: string, options?: FetcherOptions): Promise<T> {
  return fetcher<T>(url, { ...options, method: "GET" });
}

/**
 * POST request helper
 */
export async function post<T = unknown>(
  url: string,
  data?: unknown,
  options?: FetcherOptions
): Promise<T> {
  return fetcher<T>(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT request helper
 */
export async function put<T = unknown>(
  url: string,
  data?: unknown,
  options?: FetcherOptions
): Promise<T> {
  return fetcher<T>(url, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request helper
 */
export async function del<T = unknown>(url: string, options?: FetcherOptions): Promise<T> {
  return fetcher<T>(url, { ...options, method: "DELETE" });
}
