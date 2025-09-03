<template>
    <div class="p-4" style="height: 90vh; overflow-y: auto;">
        <Button severity="secondary" label="← Back" text @click="router.back()" />

        <h2 class="mb-2">{{ selectedRequest?.name }}</h2>
        <strong>Message</strong>
        <Card class="mb-2">
            <template #content>
                {{ selectedRequest?.message || "—" }}
            </template>
        </Card>
        <p><strong>Created At:</strong> {{ formatDate(selectedRequest?.created_at) }}</p>
        <p><strong>Status:</strong>
            <Tag class='ml-2' :value="status" :severity="getStatusSeverity()" />
        </p>

        <Divider />

        <div class="flex gap-2 mt-4">
            <Button :disabled="!!selectedRequest?.approved_at"
                :label="selectedRequest?.approved_at ? 'Request approved' : 'Approve'" severity="success"
                @click="approve" />
            <Button :disabled="!!selectedRequest?.declined_at"
                :label="selectedRequest?.declined_at ? 'Request declined' : 'Decline'" severity="danger"
                @click="decline" />
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { eegUserApi } from "@/api/eegUserApi";
import { type UserDataRequest } from "@/api/userDataRequest";
import router from "@/router";
import { formatDate } from "@/utils/datetime";


const route = useRoute();
const selectedRequest = ref<UserDataRequest>();

const selectedRequestId = computed(() => {
    const requestId = route.query.id;
    return requestId ? requestId : null;
});

onMounted(async () => {
    if (!selectedRequestId.value) router.back();
    selectedRequest.value = await eegUserApi.fetchUserRequest(
        selectedRequestId.value as string
    );
});

const status = computed(() =>
    selectedRequest.value?.approved_at
        ? "Approved"
        : selectedRequest.value?.declined_at
            ? "Declined"
            : "Pending"
);

function getStatusSeverity() {
    if (status.value === "Approved") return "success";
    if (status.value === "Declined") return "danger";
    return "warn";
}

function approve() {
    eegUserApi.approveUserRequest(selectedRequestId.value.toString());
}

function decline() {
    eegUserApi.declineUserRequest(selectedRequest.value.toString());
}
</script>
