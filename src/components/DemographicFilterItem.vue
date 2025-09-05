<template>
    <div class="flex items-start gap-2 p-2">
        <div class="flex flex-col">
            <Select v-model="filter.field" placeholder="Select demographic..." class="justify-self-start w-[12vw]"
                :options="availableDemographics.map(d => d.name)" @update:model-value="onDemographicSelected" />
            <!-- <InlineMessage v-if="!filter.field" severity="error">
                Please select a field
            </InlineMessage> -->
        </div>

        <div v-if="selectedDemographic" class="flex items-start gap-2">
            <Select v-model="filter.comparator" class="w-[12vw]"
                :options="selectedDemographic.comparators.map(c => ({ label: comparatorReadableNames[c], value: c }))"
                optionLabel="label" optionValue="value" placeholder="Select Comparator..." />
        </div>

        <div v-if="filter.comparator === 'in'" class="flex flex-col gap-2">
            <div v-for="(val, i) in filterValues" :key="i" class="flex items-center gap-2">
                <Select v-if="selectedDemographic.options" :options="selectedDemographic.options"
                    v-model="filterValues[i]" class="w-[12vw]" />
                <InputText v-else v-model="filterValues[i]" class="w-[12vw]" placeholder="..." />
                <Button icon="pi pi-times" severity="danger" text @click="removeFilterValue(i)" />
            </div>
            <Button icon="pi pi-plus" class="w-[12vw]" label="Add Value" text @click="addFilterValue()" />
        </div>

        <div v-else-if="selectedDemographic && selectedDemographic.type !== 'boolean'" class="flex items-start">
            <Select v-if="selectedDemographic.options" v-model="filter.value" :options="selectedDemographic.options"
                class="w-[12vw]" />
            <InputText v-else v-model="filter.value" placeholder="Value" />
        </div>

        <div v-else>
            <Select v-if="selectedDemographic && selectedDemographic.type === 'boolean'" v-model="filter.value"
                :options="[true, false]" class="w-[12vw]" />
        </div>

        <div>
            <Message v-if="!filter.field || !filter.comparator || !filter.value" icon="pi pi-exclamation-circle"
                severity="error">
                Please provide all filter values
            </Message>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { DemographicFilter } from '@/api/sample';
import { ref, watch } from 'vue';

interface Demographic {
    name: string,
    type: 'boolean' | 'number' | 'string' | 'categorical',
    comparators: string[],
    options: string[] | null
}

const props = defineProps<{
    filter: DemographicFilter;
}>();

const comparatorReadableNames = {
    'eq': "equals",
    'neq': "not equals",
    'gt': "greater than",
    'lt': "less than",
    'gte': "greater than or equal",
    'lte': "less than or equal",
    'in': 'in'
}

const availableDemographics = ref<Demographic[]>([
    {
        name: "age",
        type: "number",
        comparators: ["lt", "lte", "gt", "gte", "eq", "neq"],
        options: null
    },
    {
        name: "handness",
        type: "categorical",
        comparators: ["eq", "neq"],
        options: ["R", "L"]
    },
    {
        name: "sex",
        type: "categorical",
        comparators: ["eq", "neq"],
        options: ["M", "F"]
    },
    {
        name: "residential_area",
        type: "categorical",
        comparators: ["eq", "neq"],
        options: ["Rural", "Urban"]
    },
    {
        name: "from_city",
        type: "string",
        comparators: ["eq", "neq"],
        options: null
    },
    {
        name: "single",
        type: "boolean",
        comparators: ["eq", "neq"],
        options: null
    },
    {
        name: "education",
        type: "categorical",
        comparators: ["eq", "neq", "in"],
        options: ["ElementarySchool", "HighSchool", "BsC", "MsC", "PhD"]
    },
    {
        name: "field_of_study",
        type: "string",
        comparators: ["eq", "neq"],
        options: null
    },
    {
        name: "occupation",
        type: "string",
        comparators: ["eq", "neq"],
        options: null
    },
    {
        name: "languages_spoken",
        type: "number",
        comparators: ["lt", "lte", "gt", "gte", "eq", "neq"],
        options: null
    },
    {
        name: "used_to_sport",
        type: "boolean",
        comparators: ["eq", "neq"],
        options: null
    },
    {
        name: "current_sport",
        type: "number",
        comparators: ["lt", "lte", "gt", "gte", "eq", "neq"],
        options: ["0", "1", "2", "3"]
    },
    {
        name: "neuro_disorder",
        type: "boolean",
        comparators: ["eq", "neq"],
        options: null
    },
    {
        name: "sleep_hours",
        type: "number",
        comparators: ["lt", "lte", "gt", "gte", "eq", "neq"],
        options: null
    },
    {
        name: "smoking",
        type: "boolean",
        comparators: ["eq", "neq"],
        options: null
    },
    {
        name: "alcohol",
        type: "number",
        comparators: ["lt", "lte", "gt", "gte", "eq", "neq"],
        options: ["0", "1", "2", "3"]
    },
    {
        name: "language",
        type: "categorical",
        comparators: ["eq", "neq"],
        options: ["HR", "EN"]
    }
]
)
const selectedDemographic = ref<Demographic>();

const onDemographicSelected = (newDemographic) => {
    selectedDemographic.value = availableDemographics.value.find(d => d.name == newDemographic);
}

const filterValues = ref<string[]>(
    props.filter.value ? (props.filter.value as string).split(",").map(v => v.trim()) : []
);

watch(
    filterValues,
    (newValues) => {
        props.filter.value = newValues.join(",");
    },
    { deep: true }
);


const addFilterValue = () => {
    filterValues.value.push("");
}

const removeFilterValue = (idx: number) => {
    filterValues.value.splice(idx, 1);
}


</script>