import { defineStore } from "pinia";
import { userDataRequestApi, type Marker, type UserDataRequest } from "@/api/userDataRequest";


export const useUserDataRequestStore = defineStore("userDataRequests", {
  state: () => ({
    requests: [] as UserDataRequest[],
    availableColumns: [] as string[],
    availableMarkers: [] as Marker[],
    availableDemographics: [] as string[],
    loading: false,
  }),

  actions: {
    async loadRequests() {
      this.loading = true;
      try {
        this.requests = await userDataRequestApi.fetchUserRequests();
      } finally {
        this.loading = false;
      }
    },
    async loadAvailableColumns() {
      this.loading = true;
      try {
        this.availableColumns = await userDataRequestApi.fetchAvailableColumns();
      } catch (error) {
        console.error("Failed to load columns", error);
      } finally {
        this.loading = false;
      }
    },
    async loadAvailableMarkers() {
      this.loading = true;
      try {
        this.availableMarkers = await userDataRequestApi.fetchAvailableMarkers();
      } catch (error) {
        console.error("Failed to load columns", error);
      } finally {
        this.loading = false;
      }
    },
    async loadAvailableDemographics() {
      this.loading = true;
      try {
        this.availableDemographics = await userDataRequestApi.fetchAvailableDemographics();
      } catch (error) {
        console.error("Failed to load columns", error);
      } finally {
        this.loading = false;
      }
    }
    // async downloadRequest(id: number) {
    //   await downloadRequestData(id);
    // },
  },
});
