import API from './axios';


export interface CarteCadeau{
  id:number;
  reduction_percent: number ;
  amount: number;
  is_active :number;
  service : Prestations;
}

export interface Prestations {
  id: number;
  title: string;
  description?: string;
  detail?: string;
  service_category_id: number;
  price?: number;
  price_reduction?: number;
  duration_minutes?: number;
  validity_days?: number;
  remarque?: string;
  is_active: number;
  service_category : ServiceType;
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  is_active: number;
  image_url?: string;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: {
    cartecadeau: CarteCadeau[];
  };
}

export const carteCadeauService = {
  getAll: async (): Promise<{ success: boolean; data: CarteCadeau[] }> => {
    try {
      const response = await API.get<ServiceResponse>('/cartecadeauservice');
      return { success: response.data.success, data: response.data.data.cartecadeau, };
    } catch (error) {
      console.error('erreur sur les services :', error);
      return { success: false, data: [] };
    }
  },
  
};
