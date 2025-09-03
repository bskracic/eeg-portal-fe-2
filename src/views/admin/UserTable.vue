<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Filtering</div>
        <DataTable :rowsPerPageOptions="[5, 10, 20, 50]" :value="eegUsers" :paginator="true" :rows="10" dataKey="id"
            @row-click="rowClicked" :rowHover="true" filterDisplay="menu" :filters="filters"
            :globalFilterFields="['username', 'email']" showGridlines>
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No users found. </template>
            <template #loading> Loading users data. Please wait. </template>
            <Column field="id" header="Id" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.id }}
                </template>
            </Column>
            <Column field="username" header="Username" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.username }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by username" />
                </template>
            </Column>

            <Column field="email" header="Email" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.email }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by email" />
                </template>
            </Column>
            <Column field="description" header="Description" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.description }}
                </template>
            </Column>
            <Column header="Date joined" filterField="date_joined" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.date_joined) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
            <Column field="approved_at" header="Approved" dataType="boolean" bodyClass="text-center"
                style="min-width: 8rem">
                <template #body="{ data }">
                    <i class="pi"
                        :class="{ 'pi-check-circle text-green-500 ': data.approved_at, 'pi-times-circle text-red-500': !data.approved_at }"></i>
                </template>
                <template #filter="{ filterModel }">
                    <label for="verified-filter" class="font-bold"> Verified </label>
                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary
                        inputId="verified-filter" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import type { EegUser } from "@/api/eegUserApi";
import { useEegUserStore } from "@/stores/eegUserStore";
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { DataTableRowClickEvent } from "primevue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const eegUsers = computed<EegUser[]>(() => eegStore.eegUsers);
const eegStore = useEegUserStore();
const router = useRouter();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    date_joined: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
});

onMounted(async () => {
    if (!eegStore.eegUsers.length) await eegStore.loadEegUsers();
});

const rowClicked = (event: DataTableRowClickEvent<EegUser>) => {
    const userId = event.data.id;
    router.push({
        path: '/users/detail',
        query: {
            id: userId
        }
    });
}

function getStatus(user: EegUser) {
    if (user.approved_at) return "approved";
    return "pending";
}

function getStatusColor(user: EegUser) {
    if (user.approved_at) return "green";
    return "orange";
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString();
}

function goToUserDetail(e: Event, selected: any) {
    const user: EegUser = selected.item;
    router.push({
        path: "/admin/user",
        query: { id: user.id },
    });
}
</script>