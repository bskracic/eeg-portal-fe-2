<template>
    <div class="overflow-x-hidden">
        <Stepper :value="step">
            <StepList>
                <Step :value="1" />
                <Step :value="2" />
                <Step :value="3" />
                <Step :value="4" />
            </StepList>
        </Stepper>
        <div class="flex items-center gap-4 mb-4">
            <Button v-if="step > 1" outlined label="Back" @click="step--" />
            <div class="flex-grow"></div>
            <Button v-if="step < 4" label="Next" @click="step++" />
            <Button v-else label="Submit Request" severity="success" @click="handleSubmit" />
        </div>

        <div v-if="step === 1" class="space-y-4">
            <h3>Description for data use case</h3>
            <p>Please provide the details on how are you planning to use the data.</p>
            <div class="flex flex-col gap-2">
                <label for="name">Subject</label>
                <InputText id="name" v-model="name" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="message">Message</label>
                <Textarea class="h-50" id="message" v-model="message" autoResize />
            </div>
        </div>

        <div v-if="step === 2">
            <h3>Select Markers</h3>
            <div class="flex items-center justify-items-center gap-2 mb-5">
                <p>Select which markers you want included in your data.</p>
                <Button size="small" outlined @click="togleAllMarkers">
                    {{ allMarkersSelected ? "Deselect All" : "Select All" }}
                </Button>
            </div>
            <div class="h-[70vh] overflow-y-auto">
                <div v-for="marker in userDataRequestStore.availableMarkers" :key="marker.id"
                    class="flex items-center gap-2 py-1">
                    <Checkbox v-model="selectedMarkers" :inputId="'marker-' + marker.id" :value="marker.id" />
                    <label :for="'marker-' + marker.id">{{ marker.type }}</label>
                </div>
            </div>
        </div>

        <div v-if="step === 3">
            <h3>Define Demographic Filters</h3>
            <p>Specify which part of the data collection you want to use. Executing the query will provide the sample
                data.</p>
            <div v-for="(filter, index) in demographicFilters" :key="index" class="flex gap-2 mb-2 items-start">
                <Button class="mt-2" icon="pi pi-trash" text severity="danger" @click="removeFilter(index)" />
                <DemographicFilterItem :filter="filter" />
            </div>
            <Button outlined label="+ Add Filter" @click="addFilter" class="w-[25%]" />
            <div class="flex justify-end">
                <Button v-if="demographicFilters" severity="success" label="Run example query" icon="pi pi-play"
                    @click="fetchHead" />
            </div>
            <Divider />

            <DataTable v-if="filteredDataHead && filteredDataHead.length !== 0" :value="filteredDataHead" scrollable
                scrollDirection="both" dataKey="timestamp" responsiveLayout="scroll" class="w-full">
                <template #header>
                    <span class="text-xl font-bold">Results</span>
                </template>
                <Column field="timestamp" header="Timestamp" style="min-width: 200px">
                    <template #body="{ data }">
                        {{ formatDate(data.timestamp) }}
                    </template>
                </Column>
                <Column v-for="col in Object.keys(filteredDataHead[0]).filter((c) => c !== 'timestamp')" :key="col"
                    :field="col" :header="col.toUpperCase()" style="min-width: 120px" />
            </DataTable>
        </div>
        <div v-if="step === 4">
            <h3>Select Columns</h3>
            <div class="flex items-center gap-2 mb-5">
                <p>Select which columns you want included in your data.</p>
                <Button size="small" outlined @click="togleAllColumns">
                    {{ allColumnsSelected ? "Deselect All" : "Select All" }}
                </Button>
            </div>
            <div class="h-[70vh] overflow-y-auto">
                <div v-for="col in userDataRequestStore.availableColumns" :key="col"
                    class="flex items-center gap-2 py-1">
                    <Checkbox v-model="selectedColumns" :inputId="'col-' + col" :value="col" />
                    <label :for="'col-' + col">{{ col }}</label>
                </div>
            </div>
        </div>
        <Toast group="tc" position="top-center" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from "primevue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { computed, onMounted, ref } from "vue";

import { DemographicFilter, sampleApi } from "@/api/sample";
import type { CreateUserDataRequest } from "@/api/userDataRequest";
import DemographicFilterItem from "@/components/DemographicFilterItem.vue";
import router from "@/router";
import { userDataRequestService } from "@/services/userDataRequestService";
import { useUserDataRequestStore } from "@/stores/userDataRequestStore";
import { formatDate } from "@/utils/datetime";

const userDataRequestStore = useUserDataRequestStore();
const toast = useToast();

const step = ref(1);
const selectedColumns = ref<string[]>([]);
const selectedMarkers = ref<number[]>([]);
const demographicFilters = ref<DemographicFilter[]>([]);
const name = ref("");
const message = ref("");
const filteredDataHead = ref([]);

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

const fetchHead = async () => {
    filteredDataHead.value = await sampleApi.getSampleReadHead(demographicFilters.value);
}

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
