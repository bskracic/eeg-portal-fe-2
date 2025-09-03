import { sampleApi, type SampleDto, type SampleResponseDto } from "@/api/sample";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSampleStore = defineStore("samples", () => {
  const samples = ref<SampleDto[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const setError = (newError: string | null) => {
    error.value = newError;
  };

  const setLoading = (newLoading: boolean) => {
    loading.value = newLoading;
  };

  const clearError = () => {
    error.value = null;
  };

  const createSample = async (sample: SampleDto) => {
    setLoading(true);
    clearError();

    try {
      const sampleResponse: SampleResponseDto = await sampleApi.createSample(sample);
      setError("success");
      return sampleResponse;
    } catch(error: any) {
      setError("error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    samples,
    error,
    loading,
    createSample
  };
});