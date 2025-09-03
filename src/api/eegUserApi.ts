import api, { API_ENDPOINTS } from "./api";
import type { UserDataRequest } from "./userDataRequest";

export interface EegUser {
  id: string;
  organization_name: string;
  username: string;
  email: string;
  description: string;
  approved_at: string;
  date_joined: string;
}

// TODO: consider pagination
export const eegUserApi = {
  fetchUsers: async (): Promise<EegUser[]> => {
    const { data } = await api.get(API_ENDPOINTS.USER.RETRIEVE_ALL);
    return data.results;
  },
  fetchUserById: async (userId: string): Promise<EegUser> => {
    const { data } = await api.get(API_ENDPOINTS.USER.RETRIEVE(userId));
    return data;
  },
  fetchUsersRequests: async (userId: string): Promise<UserDataRequest[]> => {
    const { data } = await api.get(API_ENDPOINTS.USER.RETRIEVE_REQUESTS(userId));
    return data;
  },
  fetchUserRequest: async (userRequestId: string): Promise<UserDataRequest> => {
    const { data } = await api.get(API_ENDPOINTS.USER.RETRIEVE_REQUEST(userRequestId));
    return data;
  },
  approveUserRequest: async (userRequestId: string): Promise<void> => {
    await api.patch(API_ENDPOINTS.USER.APPROVE_REQUEST(userRequestId));
  },
  declineUserRequest: async (userRequestId: string): Promise<void> => {
    await api.patch(API_ENDPOINTS.USER.APPROVE_REQUEST(userRequestId));
  }
}