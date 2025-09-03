<template>
    <h3>Create Sample</h3>
    <form @submit.prevent="() => { }" class="flex flex-col gap-4">
        <div class="flex flex-col md:flex-row gap-4">
            <!-- Personal Info Card -->
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Personal Info</div>

                    <div class="flex flex-col gap-2">
                        <label for="age">Age *</label>
                        <InputNumber id="age" v-model="form.age" :min="0" :class="{ 'p-invalid': form.age === null }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="sex">Sex (M/F) *</label>
                        <Select id="sex" v-model="form.sex" :options="['M', 'F']" placeholder="Select sex"
                            :class="{ 'p-invalid': form.sex === null }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="handness">Handness (L/R) *</label>
                        <Select id="handness" v-model="form.handness" :options="['R', 'L']"
                            placeholder="Select handness" :class="{ 'p-invalid': form.handness === null }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="residential_area">Residential Area *</label>
                        <Select id="residential_area" v-model="form.residential_area" :options="['Urban', 'Rural']"
                            placeholder="Select area" :class="{ 'p-invalid': form.residential_area === null }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="from_city">From City *</label>
                        <InputText id="from_city" v-model="form.from_city"
                            :class="{ 'p-invalid': form.from_city === '' }" />
                    </div>

                    <div class="flex gap-4">
                        <div class="flex items-center gap-2">
                            <Checkbox id="single" v-model="form.single" />
                            <label for="single">Single</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox id="used_to_sport" v-model="form.used_to_sport" />
                            <label for="used_to_sport">Used to Sport</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox id="plays_instrument" v-model="form.plays_instrument" />
                            <label for="plays_instrument">Plays Instrument</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Education & Occupation Card -->
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Education & Occupation</div>

                    <div class="flex flex-col gap-2">
                        <label for="education">Education *</label>
                        <Select id="education" v-model="form.education" :options="educationOptions"
                            placeholder="Select education" :class="{ 'p-invalid': form.education === null }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="field_of_study">Field of Study *</label>
                        <InputText id="field_of_study" v-model="form.field_of_study"
                            :class="{ 'p-invalid': form.field_of_study === '' }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="occupation">Occupation *</label>
                        <InputText id="occupation" v-model="form.occupation"
                            :class="{ 'p-invalid': form.occupation === '' }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="languages_spoken">Languages Spoken *</label>
                        <InputNumber id="languages_spoken" v-model="form.languages_spoken" :min="0"
                            :class="{ 'p-invalid': form.languages_spoken === null }" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="language">Language *</label>
                        <InputText id="language" v-model="form.language"
                            :class="{ 'p-invalid': form.language === '' }" />
                    </div>
                </div>
            </div>
        </div>



        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl">Habits</div>

            <!-- Radio button groups in the same row -->
            <div class="flex flex-col md:flex-row gap-4">
                <!-- Current Sport -->
                <div class="flex flex-col md:w-1/3 gap-2">
                    <label>Current Sport (0-4) *</label>
                    <div class="flex gap-2">
                        <div v-for="n in 5" :key="'sport-' + n" class="flex items-center gap-1">
                            <RadioButton v-model="form.current_sport" :value="n - 1"
                                :inputId="'current_sport_' + (n - 1)" />
                            <label :for="'current_sport_' + (n - 1)">{{ n - 1 }}</label>
                        </div>
                    </div>
                </div>

                <!-- Smoking -->
                <div class="flex flex-col md:w-1/3 gap-2">
                    <label>Smoking (0-4) *</label>
                    <div class="flex gap-2">
                        <div v-for="n in 5" :key="'smoking-' + n" class="flex items-center gap-1">
                            <RadioButton v-model="form.smoking" :value="n - 1" :inputId="'smoking_' + (n - 1)" />
                            <label :for="'smoking_' + (n - 1)">{{ n - 1 }}</label>
                        </div>
                    </div>
                </div>

                <!-- Alcohol -->
                <div class="flex flex-col md:w-1/3 gap-2">
                    <label>Alcohol (0-4) *</label>
                    <div class="flex gap-2">
                        <div v-for="n in 5" :key="'alcohol-' + n" class="flex items-center gap-1">
                            <RadioButton v-model="form.alcohol" :value="n - 1" :inputId="'alcohol_' + (n - 1)" />
                            <label :for="'alcohol_' + (n - 1)">{{ n - 1 }}</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sleep hours -->
            <div class="flex flex-col gap-2 mt-4">
                <label for="sleep_hours">Sleep Hours *</label>
                <InputNumber id="sleep_hours" v-model="form.sleep_hours" :min="0"
                    :class="{ 'p-invalid': form.sleep_hours === null }" />
            </div>

            <FileUpload ref="file" mode="basic" accept=".csv" choose-label="EEG Reads File" />

            <div class="flex items-center justify-end mt-4">
                <Button label="Submit" type="submit" :disabled="!isFormValid" @click="submit" style="width: 10vw" />
            </div>
        </div>
        <Toast position="top-center" group="tc" />
        <Toast position="top-center" group="tc-upload">
            <template #container="{ message, closeCallback }">
                <section v-if="loading" class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
                    <div class="flex items-center gap-5">
                        <i class="pi pi-cloud-upload text-white dark:text-black text-2xl"></i>
                        <span class="font-bold text-base text-white dark:text-black">{{ message.summary }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                    </div>
                </section>
                <section v-else class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
                    <div class="flex items-center gap-5">
                        <i class="pi pi-cloud-upload text-white dark:text-black text-2xl"></i>
                        <span class="font-bold text-base text-white dark:text-black">Sample uploaded.</span>
                        <Button label="Ok" size="small" @click="closeCallback"></Button>
                    </div>
                </section>
            </template>
        </Toast>
    </form>
</template>



<script setup lang="ts">
import { sampleService, type SampleUploadForm } from "@/services/sampleService";
import { Button, Checkbox, InputNumber, InputText, RadioButton, Select, useToast } from "primevue";
import { computed, reactive, ref } from "vue";

const educationOptions = [
    'ElementarySchool',
    'HighSchool',
    'BsC',
    'MsC',
    'PhD',
];

const requiredFields = [
    'age',
    'handness',
    'sex',
    'residential_area',
    'from_city',
    'education',
    'field_of_study',
    'occupation',
    'languages_spoken',
    'current_sport',
    'sleep_hours',
    'smoking',
    'alcohol',
    'language',
];

// const form = reactive<SampleUploadForm>({
//     age: 18,
//     handness: "",
//     sex: "",
//     residential_area: "",
//     from_city: "",
//     single: false,
//     education: "",
//     field_of_study: "",
//     occupation: "",
//     languages_spoken: 1,
//     used_to_sport: false,
//     current_sport: 0,
//     plays_instrument: false,
//     neuro_disorder: false,
//     sleep_hours: 0,
//     smoking: 0,
//     alcohol: 0,
//     language: "HR",
// });

const toast = useToast();

const form = reactive<SampleUploadForm>({
    age: 18,
    handness: "R",
    sex: "M",
    residential_area: "Urban",
    from_city: "Zadar",
    single: true,
    education: "MsC",
    field_of_study: "IT",
    occupation: "Programer",
    languages_spoken: 2,
    used_to_sport: true,
    current_sport: 1,
    plays_instrument: true,
    neuro_disorder: false,
    sleep_hours: 6,
    smoking: 1,
    alcohol: 3,
    language: "EN",
});

const file = ref(null);
const sampleId = ref<string | null>(null);
const loading = ref(false);


const isFormValid = computed(() => {
    return requiredFields.every((field) => {
        const value = form[field];
        return value !== null && value !== '' && value !== undefined;
    });
});

const submit = async () => {
    loading.value = true;
    sampleService
        .createSample(form)
        .then(async (data) => {
            sampleId.value = data.id;
            await uploadFile();
        })
        .catch(() => {
            showErrorToast();
            loading.value = false;
        });
};

const uploadFile = async () => {
    if (!sampleId.value || !file.value) {
        showErrorToast();
        throw null;
    };
    showUploadToast();
    sampleService
        .uploadSampleRead(sampleId.value, file.value.files[0])
        .then((msg) => {
            loading.value = false;
            showSuccessToast(msg);
        })
        .catch((err) => {
            console.log(err);
            showErrorToast();
        }).finally(() =>
            loading.value = false
        );
};

const showErrorToast = () => {
    toast.add({ severity: 'error', summary: 'Upload Error', life: 3000, group: 'tc' });
}

const showSuccessToast = (msg: string) => {
    toast.add({ severity: 'success', summary: 'Upload successful', detail: msg, life: 3000, group: 'tc' });
}

const showUploadToast = () => {
    toast.add({ severity: 'custom', summary: 'Uploading your sample, please wait...', group: 'tc-upload' });
}

</script>


<style scoped>
.p-field {
    margin-bottom: 1rem;
}
</style>
