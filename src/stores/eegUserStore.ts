import { eegUserApi, type EegUser } from "@/api/eegUserApi";
import { defineStore } from "pinia";

export const useEegUserStore = defineStore("eegUser", {
    state: () => ({
        eegUsers: [] as EegUser[],
    }),
    actions: {
        async loadEegUsers() {
            this.eegUsers = await eegUserApi.fetchUsers();
        }
    }
});