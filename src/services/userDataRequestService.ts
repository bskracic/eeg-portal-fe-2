import { userDataRequestApi, type CreateUserDataRequest } from "@/api/userDataRequest";

export const userDataRequestService = {
  async createDataRequest(data: CreateUserDataRequest) {
    await userDataRequestApi.createDataRequest(data);
  }
};