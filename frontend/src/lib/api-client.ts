/**
 * 🎯 API Client - Next.js Frontend API Integration
 * 
 * Mirrors backend patterns for consistent error handling and response formatting
 * Uses Next.js API routes as proxy to backend FootyStats integration
 */

import { ApiResponse, ApiError, ServiceResponse } from '@/types/api';

// ===== CONFIGURATION =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// ===== ERROR CLASSES =====
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class NetworkError extends ApiClientError {
  constructor(message: string = 'Network connection failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiClientError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

// ===== API CLIENT CLASS =====
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Make HTTP request with error handling and response formatting
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ServiceResponse<T>> {
    const url = `${this.baseUrl}/api/${API_VERSION}${endpoint}`;
    
    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      // Handle network errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        throw new ApiClientError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code,
          errorData.details
        );
      }

      const data = await response.json();
      
      console.log(`✅ API Response: ${response.status} ${endpoint}`);
      
      return {
        success: true,
        data: data.data || data,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'nextjs-api-client',
          ...data.metadata
        }
      };

    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      // Handle fetch errors (network issues)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Failed to connect to backend API');
      }
      
      // Handle unknown errors
      throw new ApiClientError(
        error instanceof Error ? error.message : 'Unknown API error',
        500,
        'UNKNOWN_ERROR'
      );
    }
  }

  // ===== HTTP METHODS =====
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ServiceResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ===== UTILITY METHODS =====
  
  /**
   * Handle API response with proper error formatting
   */
  static handleResponse<T>(response: ServiceResponse<T>): T {
    if (!response.success) {
      throw new ApiClientError(
        response.error || 'API request failed',
        500,
        'API_ERROR'
      );
    }
    
    return response.data;
  }

  /**
   * Format error for UI display
   */
  static formatError(error: unknown): ApiError {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    return error instanceof NetworkError;
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: unknown): boolean {
    return error instanceof ValidationError;
  }
}

// ===== SINGLETON INSTANCE =====
export const apiClient = new ApiClient();

// ===== CONVENIENCE FUNCTIONS =====
export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>) => 
    apiClient.get<T>(endpoint, params),
  
  post: <T>(endpoint: string, data?: any) => 
    apiClient.post<T>(endpoint, data),
  
  put: <T>(endpoint: string, data?: any) => 
    apiClient.put<T>(endpoint, data),
  
  delete: <T>(endpoint: string) => 
    apiClient.delete<T>(endpoint),
};
