import API from './axios';
import { Client } from './serviceCategoryApi';


export interface CarteCadeau{
  id:number;
  reduction_percent: number ;
  amount: number;
  is_active : number;
  service : Prestations;
}

export interface CarteCadeauClient{
  id:number;
  code : string ;
  benef_name: string;
  benef_contact :string;
  benef_email : string;
  carte_cadeau_service_id: number;
  message?: string;
  client_id?: number;
  amount: string; 
  start_date:string;
  end_date :string;
  is_active: number;
  clients: Client;
  carte_cadeau_service: CarteCadeau; 
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

interface Beneficiaire {
  name: string;
  contact: string;
  email: string;
  message: string;
}

interface Donneur {
  name: string;
  email: string;
  password: string;
  contact: string;
}

interface SavePayload {
  beneficiaire: Beneficiaire;
  donneur: Donneur;
  prestationId: number;
  price: number;
}

interface SaveResponse {
  success: boolean;
  data?: any;
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
  async getByCode(code: string) {
    return API.get("/cartecadeaubycode", { params: { code } });
  },

  async getByClientId(client_id: number): Promise<{ success: boolean; data: CarteCadeauClient[] }> {
    try {
      const response = await API.get<{ success: boolean; data: CarteCadeauClient[] }>("/cartecadeaubyclient", { params: { client_id } });
      return { success: response.data.success, data: response.data.data };
    } catch (error) {
      console.error('Erreur getByClientId :', error);
      return { success: false, data: [] };
    }
  },
  save : async (payload: SavePayload): Promise<SaveResponse> => {
    try {
      const response = await API.post("/cartecadeauservice/create", payload);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      return {
        success: false,
      };
    }
  }

  };
