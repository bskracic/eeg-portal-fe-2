import api, { API_ENDPOINTS } from './api'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  refresh: string
  access: string
  role: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  organization_name: string
  description: string
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data
    } catch(err) {
      throw err;
    }
  },
  register: async (credentials: RegisterRequest): Promise<void> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, credentials);
    return response.data
  },
}

