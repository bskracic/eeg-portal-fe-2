import api, { API_ENDPOINTS } from "./api";

// TODO: Include pagination
export interface UserDataRequest {
  id: number;
  name: string;
  message: string | null;
  created_at: string;
  approved_at: string | null;
  declined_at: string | null;
  request_columns: { column_name: string }[];
  request_markers: { id: number, approved_at: string, marker: {id: number, type: string} }[];
  request_demographic_filters: { field: string; comparator: string; value: string }[];
}

export interface CreateUserDataRequest {
  name: string;
  message: string | null;
  request_columns: {
    column_name: string
  }[];
  request_markers: {
    marker_id: number;
  }[];
  request_demographic_filters: {
    field: string;
    comparator: string;
    value: string;
  }[];
}

export interface Marker {
  id: number;
  type: string;
}

export const userDataRequestApi = {
  fetchUserRequests: async (): Promise<UserDataRequest[]> => {
    const { data } = await api.get(API_ENDPOINTS.DATA_REQUEST.RETRIEVE_ALL);
    return data.results;
  },
  fetchAvailableColumns: async (): Promise<string[]> => {
    const response = await api.get(API_ENDPOINTS.DATA_REQUEST.AVAILABLE_COLUMNS);
    return response.data;
  },
  fetchAvailableMarkers: async (): Promise<Marker[]> => {
    const response = await api.get(API_ENDPOINTS.DATA_REQUEST.AVAILABLE_MARKERS);
    return response.data;
  },
  fetchAvailableDemographics: async (): Promise<string[]> => {
    const response = await api.get(API_ENDPOINTS.DATA_REQUEST.AVAILABLE_DEMOGRAPHICS);
    return response.data;
  },
  createDataRequest: async(data: CreateUserDataRequest): Promise<void> => {
    await api.post(API_ENDPOINTS.DATA_REQUEST.CREATE, data);
  }
}