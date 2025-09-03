import router from '@/router';
import { storage } from '@/services/storageService';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

// Environment variables should be used for API URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// Create axios instance with default config
const createApiInstance = (): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    // Add reasonable timeout
    timeout: 15000,
  };

  const instance = axios.create(config);

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = storage.get('access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle common errors (401, 403, etc.)
      if (error.response?.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized error:', error.response);
        storage.remove('access');

        if (router.currentRoute.value.path !== '/auth/login') {
          router.push({
            path: '/auth/login'
          })
        }

      }
      return Promise.reject(error);
    }
  );
  return instance;
};

const createPublicApiInstance = (): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
  };
  return axios.create(config);
};

export const api = createApiInstance();
export const publicApi = createPublicApiInstance();

// API endpoints organized by feature
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout', // TODO: implement in future
    REFRESH: '/api/auth/refresh', // TODO: implement in future
    REGISTER: '/api/auth/register',
  },
  SAMPLE: {
    CREATE: '/api/data/samples/',
    UPLOAD_READS: (sampleId: string) => `/api/data/samples/${sampleId}/reads/`,
    HEAD: '/api/data/head/'
  },
  USER: {
    RETRIEVE_ALL: '/api/users/',
    RETRIEVE: (userId: string) => `/api/users/${userId}/`,
    RETRIEVE_REQUESTS: (userId: string) => `/api/users/${userId}/requests/`,
    RETRIEVE_REQUEST: (userRequestId: string) => `/api/user/requests/${userRequestId}/`,
    APPROVE_REQUEST: (userRequestId: string) => `/api/user/requests/${userRequestId}/approve/`,
    DECLINE_REQUEST: (userRequestId: string) => `/api/user/requests/${userRequestId}/decline/`,
  },
  DATA_REQUEST: {
    AVAILABLE_COLUMNS: '/api/data/columns/',
    AVAILABLE_MARKERS: '/api/data/markers/',
    AVAILABLE_DEMOGRAPHICS: '/api/data/demographics/',
    CREATE: '/api/user/requests/',
    RETRIEVE_ALL: '/api/user/requests/',
  }
} as const;

export default api;
