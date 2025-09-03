<template>
    <div>
        <div v-if="!selectedRequest">
            <h2 class="mb-4">My Data Requests</h2>

            <DataTable :value="requests" dataKey="id" responsiveLayout="scroll" selectionMode="single"
                @row-click="selectRequest">
                <Column field="id" header="Id" />
                <Column field="name" header="Name" />
                <Column field="created_at" header="Created At">
                    <template #body="{ data }">
                        {{ formatDate(data.created_at) }}
                    </template>
                </Column>
                <Column header="Status">
                    <template #body="{ data }">
                        <Tag :value="getStatus(data)" :severity="getStatusSeverity(data)" class="capitalize" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <div v-else class="h-[90vh] overflow-y-auto p-4">
            <Button label="← Back" link @click="selectedRequest = null" class="mb-4" />

            <h3>Request #{{ selectedRequest.id }}: {{ selectedRequest.name }}</h3>

            <div class="mb-4">
                <p><strong>Message:</strong> {{ selectedRequest.message || "—" }}</p>
                <p><strong>Created At:</strong> {{ formatDate(selectedRequest.created_at) }}</p>
                <p><strong>Status:</strong>
                    <Tag :value="getStatus(selectedRequest)" :severity="getStatusSeverity(selectedRequest)" />
                </p>
            </div>

            <Divider />

            <div class="mb-4">
                <h3 class="mb-2">Columns</h3>
                <div class="flex flex-wrap gap-2">
                    <Tag v-for="col in selectedRequest.request_columns" :key="col.column_name"
                        :value="col.column_name" />
                </div>
            </div>

            <Divider />

            <div class="mb-4">
                <h3 class="mb-2">Markers</h3>
                <div class="flex flex-wrap gap-2">
                    <Tag v-for="marker in selectedRequest.request_markers" :key="marker.id"
                        :value="marker.marker.type" />
                </div>
            </div>

            <Divider />

            <div>
                <h3 class="mb-2">Demographic Filters</h3>
                <ul class="list-disc list-inside">
                    <li v-for="(demo, i) in selectedRequest.request_demographic_filters" :key="i">
                        {{ demo.field }} {{ demo.comparator }} {{ demo.value }}
                    </li>
                </ul>
            </div>

            <Divider />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button, Column, DataTable, Divider, Tag } from "primevue";
import { onMounted, ref } from "vue";

import type { UserDataRequest } from "@/api/userDataRequest";
import { useUserDataRequestStore } from "@/stores/userDataRequestStore";

const requests = ref<UserDataRequest[]>([]);
const selectedRequest = ref<UserDataRequest | null>(null);

const requestStore = useUserDataRequestStore();

onMounted(async () => {
    await requestStore.loadRequests();
    requests.value = requestStore.requests;
});

function getStatus(req: UserDataRequest) {
    if (req.approved_at) return "Approved";
    if (req.declined_at) return "Declined";
    return "Pending";
}

function getStatusSeverity(req: UserDataRequest) {
    if (req.approved_at) return "success";
    if (req.declined_at) return "danger";
    return "warning";
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString();
}

function selectRequest(event: any) {
    selectedRequest.value = event.data;
}
</script>
