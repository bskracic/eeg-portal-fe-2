import api, { API_ENDPOINTS } from "./api";

export interface UserCreated {
  id: string;
  username: string;
  email: string;
  organization_name: string;
}

export interface RequestColumn {
  id: number;
  column_name: string;
  approved_at: Date;
}

export interface RequestDemographicFilter {
  id: number;
  field: string;
  comparator: string;
  value: string;
  approved_at: Date;
}

export interface RequestMarker {
  id: number;
  marker: Marker;
  approved_at: Date;
}

export interface Marker {
  id: number;
  type: string;
}

export interface UserDataRequest {
  id: number;
  name: string;
  created_by: UserCreated;
  message: string | null;
  created_at: string;
  approved_at: string | null;
  declined_at: string | null;
  request_columns: { column_name: string }[];
  request_markers: { id: number, approved_at: string, marker: { id: number, type: string } }[];
  request_demographic_filters: { field: string; comparator: string; value: string }[];
}

export interface PagintedUserDataRequestList {
  count: number;
  next: string;
  previous: string;
  results: UserDataRequest[];
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
  fetchUserRequests: async (limit: number = 10, offset: number = 0): Promise<PagintedUserDataRequestList> => {
    const { data } = await api.get(API_ENDPOINTS.DATA_REQUEST.RETRIEVE_ALL(limit, offset));
    return data;
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
  createDataRequest: async (data: CreateUserDataRequest): Promise<void> => {
    await api.post(API_ENDPOINTS.DATA_REQUEST.CREATE, data);
  },
  downloadData: async (requestId: string): Promise<void> => {
    const type = 'blob';
    console.log('trying', type);
    api.get(API_ENDPOINTS.DATA_REQUEST.DOWNLOAD_DATA(requestId), {
      responseType: type,
      timeout: 0
    })
      .then((res) => {
        const contentDisposition = res.headers['content-disposition'];
        let filename = `request_${requestId}.csv`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match?.[1]) {
            filename = match[1];
          }
        }
        const blob = new Blob([res.data], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
      })
      .catch(err => console.error('error while trying to download file', err));
  }
}