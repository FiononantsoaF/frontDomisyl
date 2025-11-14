import API from './axios';

export interface Testimonial {
  id: number;
  file_path: string;
  is_active?: boolean;
}

export interface TestimonialResponse {
  success: boolean;
  message?: string;
  data: Testimonial[]; 
}

export const testimonial = {
  getAll: async (): Promise<TestimonialResponse> => {
    const response = await API.get<TestimonialResponse>('/temoignage');
    return response.data;
  },
};
