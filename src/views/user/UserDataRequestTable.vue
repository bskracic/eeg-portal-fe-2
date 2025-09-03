<template>
    <div>
        <div v-if="!selectedRequest">
            <h2 class="mb-4">My Data Requests</h2>
            <p>If you want to access EEG Portal's data, you have to submit the request via "New request" tool. After
                your request
                is approved by our team, you can download the requested data.</p>

            <DataTable :value="requests" dataKey="id" responsiveLayout="scroll" selectionMode="single" :lazy="true"
                paginator :rows="rows" :totalRecords="totalRecords" :loading="loading" @page="onPage"
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

        <div v-else>
            <Button label="← Back" link @click="selectedRequest = null" class="mb-4" />

            <h3>Request #{{ selectedRequest.id }}: {{ selectedRequest.name }}</h3>

            <div class="mb-4">
                <p><strong>Message:</strong> {{ selectedRequest.message || "—" }}</p>
                <p><strong>Created At:</strong> {{ formatDate(selectedRequest.created_at) }}</p>
                <p v-if="!selectedRequest.approved_at"><strong>Status:</strong>
                    <Tag :value="getStatus(selectedRequest)" :severity="getStatusSeverity(selectedRequest)" />
                </p>
                <Button v-else icon="pi pi-download" label="Download Data" @click="download" />
                <p></p>
            </div>

            <Divider />

            <Tabs value="0">
                <TabList>
                    <Tab value="0">Markers</Tab>
                    <Tab value="1">Demographics</Tab>
                    <Tab value="2">Columns</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div v-if="selectedRequest?.request_markers?.length">
                            <Tag v-for="marker in selectedRequest?.request_markers" :key="marker.id"
                                :value="marker.marker.type" severity="secondary" class="mr-2 mb-2" />
                        </div>
                        <p v-else>No markers selected.</p>
                    </TabPanel>
                    <TabPanel value="1">
                        <p v-if="!selectedRequest?.request_demographic_filters?.length">
                            No demographic filters chosen.
                        </p>
                        <ul v-else>
                            <li v-for="(demo, i) in selectedRequest?.request_demographic_filters" :key="i">
                                {{ demo.field }} {{ demo.comparator }} {{ demo.value }}
                            </li>
                        </ul>
                    </TabPanel>
                    <TabPanel value="2">
                        <div v-if="selectedRequest?.request_columns?.length">
                            <Tag v-for="col in selectedRequest?.request_columns" :key="col.column_name"
                                :value="col.column_name" severity="secondary" class="mr-2 mb-2" />
                        </div>
                        <p v-else>No columns selected.</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button, Column, DataTable, Divider, Tag } from "primevue";
import { onMounted, ref } from "vue";

import { userDataRequestApi, type UserDataRequest } from "@/api/userDataRequest";

const requests = ref<UserDataRequest[]>([]);
const selectedRequest = ref<UserDataRequest | null>(null);
const totalRecords = ref(0);
const loading = ref(false);
const rows = ref(10);

// TODO: think about how store can be better
// const requestStore = useUserDataRequestStore();

onMounted(async () => {
    // await requestStore.loadRequests();
    // requests.value = requestStore.requests;
    loadRequests(0);
});

function getStatus(req: UserDataRequest) {
    if (req.approved_at) return "Approved";
    if (req.declined_at) return "Declined";
    return "Pending";
}

function getStatusSeverity(req: UserDataRequest) {
    if (req.approved_at) return "success";
    if (req.declined_at) return "danger";
    return "warn";
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString();
}

function selectRequest(event: any) {
    selectedRequest.value = event.data;
}

async function loadRequests(page = 0) {
    loading.value = true;

    try {
        const limit = rows.value;
        const offset = page * limit;
        const response = await userDataRequestApi.fetchUserRequests(limit, offset);
        requests.value = response.results;
        totalRecords.value = response.count;
    } finally {
        loading.value = false;
    }
}

function onPage(event: any) {
    loadRequests(event.page);
}

const download = () => {
    userDataRequestApi.downloadData(selectedRequest.value.id.toString());
}

</script>
