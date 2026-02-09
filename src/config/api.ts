// API Configuration with environment-aware URLs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5050';

export const API_ENDPOINTS = {
  estimate: `${API_BASE_URL}/estimate`,
} as const;

export interface APIResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}

/**
 * Centralized API client with error handling
 */
export const apiClient = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      // Network errors or fetch failures
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  },

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  },
};
