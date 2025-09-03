<template>
    <div class="p-4">

        <h2 class="flex items-center gap-2 mb-2">
            <Button severity="secondary" label="← Back" text @click="router.back()" />
            <i class="pi pi-user"></i>
            {{ user?.username }}
        </h2>

        <div class="mb-4">
            <p><strong>ID:</strong> {{ user?.id }}</p>
            <p><strong>Registered:</strong> {{ formatDate(user?.date_joined) }}</p>
            <p><strong>User {{ user?.username }} wrote:</strong></p>
            <Card>
                <template #content>{{ user?.description }}</template>
            </Card>

        </div>
        <Button :label="user?.approved_at ? 'User already approved' : 'Approve User'" severity="success"
            @click="approveUser" :disabled="!!user?.approved_at" />

        <h3 class="mb-2">Requests</h3>
        <DataTable :value="requests" dataKey="id" class="shadow rounded" scrollable scrollHeight="80vh"
            selectionMode="single" @row-click="goToRequestDetail">
            <template #empty>User has no requests.</template>
            <Column field="id" header="ID" />
            <Column field="name" header="Subject" />
            <Column field="created_at" header="Created">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <Tag :severity="getStatusSeverity(data.status)" :value="data.status" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { eegUserApi, type EegUser } from "@/api/eegUserApi";
import { UserDataRequest } from "@/api/userDataRequest";
import { formatDate } from "@/utils/datetime";
import { Card, DataTableRowClickEvent } from "primevue";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const user = ref<EegUser>();
const requests = ref<UserDataRequest[]>([]);

const selectedUserId = computed(() => {
    const userId = route.query.id;
    return userId ? userId : null;
});

onMounted(async () => {
    if (!selectedUserId.value) router.back();

    user.value = await eegUserApi.fetchUserById(selectedUserId.value as string);
    requests.value = (
        await eegUserApi.fetchUsersRequests(selectedUserId.value as string)
    ).map((r: any) => ({
        ...r,
        status: r.approved_at
            ? "Approved"
            : r.declined_at
                ? "Declined"
                : "Pending",
    }));
});

function getStatusSeverity(status: string) {
    if (status === "Approved") return "success";
    if (status === "Declined") return "danger";
    return "warn";
}

function approveUser() {
    console.log("approving:", selectedUserId.value);
}

function goToRequestDetail(event: DataTableRowClickEvent<UserDataRequest>) {
    router.push({
        path: "/users/detail/requests",
        query: { id: event.data.id },
    });
}
</script>
