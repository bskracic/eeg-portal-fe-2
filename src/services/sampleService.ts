import { sampleApi, type SampleReadDto } from "@/api/sample";
import { userDataRequestApi } from "@/api/userDataRequest";
import { useSampleStore } from "@/stores/sampleStore"


export interface SampleUploadForm {
  age: number,
  handness: string,
  sex: string,
  residential_area: string,
  from_city: string,
  single: boolean,
  education: string,
  field_of_study: string,
  occupation: string,
  languages_spoken: number,
  used_to_sport: boolean,
  current_sport: number,
  plays_instrument: boolean,
  neuro_disorder: boolean,
  sleep_hours: number,
  smoking: number,
  alcohol: number,
  language: string,
};

const sampleStore = useSampleStore();

export const sampleService = {
  async createSample(data: SampleUploadForm) {
    try {
      const sample = sampleStore.createSample(data);
      return sample;
    } catch (error) {
      throw error;
    }
  },
  async uploadSampleRead(sampleId: string, dataFile: File): Promise<string> {
    try {
      return sampleApi.uploadRead(sampleId, dataFile);
    } catch (error) {
      throw error;
    }
  },
  async getAvailableColumns(): Promise<string[]> {
    return userDataRequestApi.fetchAvailableColumns();
  },
  async getSampleReadHead(): Promise<SampleReadDto[]> {
    return sampleApi.getSampleReadHead();
  }
};