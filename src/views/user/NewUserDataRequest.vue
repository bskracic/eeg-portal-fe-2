<template>
    <div class="overflow-x-hidden">
        <!-- Step navigation -->
        <div class="flex items-center gap-4 mb-4">
            <Button v-if="step > 1" outlined label="Back" @click="step--" />
            <div class="flex-grow"></div>
            <Button v-if="step < 4" label="Next" @click="step++" />
            <Button v-else label="Submit Request" severity="success" @click="handleSubmit" />
        </div>

        <!-- Step 1 -->
        <div v-if="step === 1" class="space-y-4">
            <h3>Description for data use case</h3>
            <div class="flex flex-col gap-2">
                <label for="name">Request Subject</label>
                <InputText id="name" v-model="name" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="message">Message for Admin</label>
                <Textarea id="message" v-model="message" autoResize />
            </div>
        </div>

        <!-- Step 2 -->
        <div v-if="step === 2">
            <div class="flex items-center gap-2 mb-5">
                <h3>Select Markers</h3>
                <Button size="small" outlined @click="togleAllMarkers">
                    {{ allMarkersSelected ? "Deselect All" : "Select All" }}
                </Button>
            </div>
            <div class="h-[80vh] overflow-y-auto">
                <div v-for="marker in userDataRequestStore.availableMarkers" :key="marker.id"
                    class="flex items-center gap-2 py-1">
                    <Checkbox v-model="selectedMarkers" :inputId="'marker-' + marker.id" :value="marker.id" />
                    <label :for="'marker-' + marker.id">{{ marker.type }}</label>
                </div>
            </div>
        </div>

        <!-- Step 3 -->
        <div v-if="step === 3">
            <h3>Define Demographic Filters</h3>
            <div v-for="(filter, index) in demographicFilters" :key="index" class="flex items-center gap-2 mb-2">
                <Dropdown v-model="filter.field" :options="userDataRequestStore.availableDemographics"
                    placeholder="Column" class="w-40" />
                <Dropdown v-model="filter.comparator" :options="operators" placeholder="Operator" class="w-32" />
                <InputText v-model="filter.value" placeholder="Value" class="w-40" />
                <Button icon="pi pi-trash" text severity="danger" @click="removeFilter(index)" />
            </div>
            <div class="flex justify-end">
                <Button outlined label="+ Add Filter" @click="addFilter" />
            </div>
        </div>

        <!-- Step 4 -->
        <div v-if="step === 4">
            <div class="flex items-center gap-2 mb-5">
                <h3>Select Columns</h3>
                <Button size="small" outlined @click="togleAllColumns">
                    {{ allColumnsSelected ? "Deselect All" : "Select All" }}
                </Button>
            </div>
            <div class="h-[80vh] overflow-y-auto">
                <div v-for="col in userDataRequestStore.availableColumns" :key="col"
                    class="flex items-center gap-2 py-1">
                    <Checkbox v-model="selectedColumns" :inputId="'col-' + col" :value="col" />
                    <label :for="'col-' + col">{{ col }}</label>
                </div>
            </div>
        </div>

        <Divider />

        <Toast group="tc" position="top-center" />
    </div>
</template>

<script setup lang="ts">
import type { CreateUserDataRequest } from "@/api/userDataRequest";
import { userDataRequestService } from "@/services/userDataRequestService";
import { useUserDataRequestStore } from "@/stores/userDataRequestStore";
import { computed, onMounted, ref } from "vue";

import router from "@/router";
import { useToast } from "primevue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

const userDataRequestStore = useUserDataRequestStore();
const toast = useToast();

interface Filter {
    field: string | null;
    comparator: string | null;
    value: string | null;
}

const step = ref(1);
const selectedColumns = ref<string[]>([]);
const selectedMarkers = ref<number[]>([]);
const demographicFilters = ref<Filter[]>([]);
const name = ref("");
const message = ref("");

const operators = [">", "<", ">=", "<=", "=", "!="];

onMounted(async () => {
    userDataRequestStore.loadAvailableDemographics();
    await userDataRequestStore.loadAvailableColumns();
    selectedColumns.value = userDataRequestStore.availableColumns;
    await userDataRequestStore.loadAvailableMarkers();
    selectedMarkers.value = userDataRequestStore.availableMarkers.map(
        (marker) => marker.id
    );
});

const allColumnsSelected = computed(() => {
    return (
        userDataRequestStore.availableColumns.length > 0 &&
        selectedColumns.value.length ===
        userDataRequestStore.availableColumns.length
    );
});

const togleAllColumns = () => {
    if (allColumnsSelected.value) {
        selectedColumns.value = [];
    } else {
        selectedColumns.value = [...userDataRequestStore.availableColumns];
    }
};

const allMarkersSelected = computed(() => {
    return (
        userDataRequestStore.availableMarkers.length > 0 &&
        selectedMarkers.value.length ===
        userDataRequestStore.availableMarkers.length
    );
});

const togleAllMarkers = () => {
    if (allMarkersSelected.value) {
        selectedMarkers.value = [];
    } else {
        selectedMarkers.value = [
            ...userDataRequestStore.availableMarkers.map((m) => m.id),
        ];
    }
};

const addFilter = () => {
    demographicFilters.value.push({
        field: null,
        comparator: null,
        value: null,
    });
};
const removeFilter = (index: number) => {
    demographicFilters.value.splice(index, 1);
};

const handleSubmit = async () => {
    const payload: CreateUserDataRequest = {
        name: name.value,
        message: message.value,
        request_columns: selectedColumns.value.map((c) => {
            return { column_name: c };
        }),
        request_markers: selectedMarkers.value.map((m) => {
            return { marker_id: m };
        }),
        request_demographic_filters: demographicFilters.value
            .filter((f) => f.field && f.comparator && f.value)
            .map((f) => {
                return {
                    field: f.field,
                    comparator: f.comparator,
                    value: f.value,
                };
            }),
    };

    await userDataRequestService.createDataRequest(payload);
    toast.add({
        severity: 'success',
        summary: 'Request submitted',
        detail: 'Request submitted successfully. Please wait for the admin to approve your request for data access before you can download data',
        group: 'tc',
        life: 5000
    });
    router.options.history.destroy();
    router.push({
        name: 'data-request-list'
    });
};
</script>
