import {api, API_ENDPOINTS } from './api'


export interface SampleDto {
  age: number;
  handness: string;
  sex: string;
  residential_area: string;
  from_city: string;
  single: boolean;
  education: string;
  field_of_study: string;
  occupation: string;
  languages_spoken: number;
  used_to_sport: boolean;
  current_sport: number;
  plays_instrument: boolean;
  neuro_disorder: boolean;
  sleep_hours: number;
  smoking: number;
  alcohol: number;
  language: string;
}

export interface SampleResponseDto extends SampleDto {
  id: string;
}

export interface SampleReadDto {
  sample_id: string;
  timestamp: string;
  af3: number;
  af4: number;
  f3: number;
  f4: number;
  f7: number;
  f8: number;
  fc5: number;
  fc6: number;
  o1: number;
  o2: number;
  p7: number;
  p8: number;
  t7: number;
  t8: number;
  cq_overall: number;
  mot_q0: number | null;
  mot_q1: number | null;
  mot_q2: number | null;
  mot_q3: number | null;
  mot_accx: number | null;
  mot_accy: number | null;
  mot_accz: number | null;
  mot_magx: number | null;
  mot_magy: number | null;
  mot_magz: number | null;

  pm_attention_isactive: number | null;
  pm_attention_scaled: number | null;
  pm_attention_raw: number | null;
  pm_attention_min: number | null;
  pm_attention_max: number | null;

  pm_engagement_isactive: number | null;
  pm_engagement_scaled: number | null;
  pm_engagement_raw: number | null;
  pm_engagement_min: number | null;
  pm_engagement_max: number | null;

  pm_excitement_isactive: number | null;
  pm_excitement_scaled: number | null;
  pm_excitement_raw: number | null;
  pm_excitement_min: number | null;
  pm_excitement_max: number | null;

  pm_longtermexcitement: number | null;

  pm_stress_isactive: number | null;
  pm_stress_scaled: number | null;
  pm_stress_raw: number | null;
  pm_stress_min: number | null;
  pm_stress_max: number | null;

  pm_relaxation_isactive: number | null;
  pm_relaxation_scaled: number | null;
  pm_relaxation_raw: number | null;
  pm_relaxation_min: number | null;
  pm_relaxation_max: number | null;

  pm_interest_isactive: number | null;
  pm_interest_scaled: number | null;
  pm_interest_raw: number | null;
  pm_interest_min: number | null;
  pm_interest_max: number | null;

  pm_focus_isactive: number | null;
  pm_focus_scaled: number | null;
  pm_focus_raw: number | null;
  pm_focus_min: number | null;
  pm_focus_max: number | null;

  marker_id: number | null;
};


export const sampleApi = {
  createSample: async (sample: SampleDto): Promise<SampleResponseDto> => {
    const response = await api.post(API_ENDPOINTS.SAMPLE.CREATE, sample);
    return response.data;
  },
  uploadRead: async (sampleId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("data", file);
    const response = await api.post(API_ENDPOINTS.SAMPLE.UPLOAD_READS(sampleId), formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 0,
    })
    return response.data.message;
  },
  getSampleReadHead: async (): Promise<SampleReadDto[]> => {
    const response = await api.get(API_ENDPOINTS.SAMPLE.HEAD);
    return response.data;
  }
}