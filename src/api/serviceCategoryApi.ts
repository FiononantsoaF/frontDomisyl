import API, {ApiResponse} from './axios';

export interface Services {
  title : string;
  description: string;
  remarque: string;
  image: string;
  details: {
    types : ServiceType[];
  };
}

export interface ServiceType {
  id : string;
  title : string;
  duration_minutes: string;
  price: string;
  description: string;
  detail: string;
  validity_days :string;
  sessions : Session[]
}

export interface CreneauResponse {
  success: boolean;
  message: string;
  data: SubscriptionList;
}

export interface Session {
  title : string;
  total_session: string;
  session_per_period: string;
  period_type:string;
}

export interface ServiceType {
  id : string;
  title : string;
  duration_minutes: string;
  price: string;
  description: string;
  detail: string;
  validity_days :string;
  sessions : Session[];
  pourcent :number;
  price_promo : number;
}

export interface Creneau {
  id : string;
  creneau :string;
}

export interface Employee {
  id: string;
  name: string;
  creneaux :Creneau[];
  services : ServiceType[];
}

export interface EmployeeCreneau{
   id:string;
   name:string;
   creneaux_det: CrenVerification[];
}

export interface CrenVerification{
  id:number;
  time:string;
  is_taken:boolean;
}

export interface BookingVerification{
  employee_id:string;
  start_times:string;
}

export interface ResponseVerification{
  success: boolean;
  message: string;
  data: {
    prestataires:EmployeeCreneau[];
  }
}

export interface ServicesWithEmployee {
  logo : string ;
  back: string;
  services: Services[];
  prestataires : Employee[];
}

export interface Client {
  name: string;
  phone: string;
  email?: string;
  address: string;
  password: string;
}

export interface User {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface BookingPayload {
  clients: Client;
  sub_id:number | null;
  employee_id: number;
  service_id: number;
  start_times: string; 
  end_times: string; 
  comment?: string;
  from_subscription: boolean;
}

export interface Login {
  login: string;
  password: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    id?: number; 
    [key: string]: any;
  } | null;
}

export interface PaiementData {
  appointment_id: number;
  subscription_id ?: number;
  price: number;
  price_promo:number;
  client_phone?: string;
  already_paid: boolean;
}

interface BookingResponsePayement {
  success: boolean;
  message: string;
  data: PaiementData | null;
}

export interface Paiement {
  amount: number;
  price: number;
  client_phone : string;
  appointment_id: number;
  subscription_id: number;
}

interface ValidateResponsePaiement {
  success: boolean;
  message: string;
  data: null;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: AppointmentList;
}

export interface Appointment {
  idrdv: number;
  status: string;
  nomclient: string;
  email: string;
  phone: string;
  formule: string;
  service: string;
  nomprestataire: string;
  prixservice: string;
  dure_minute: number | null;
  prixpromo:string;
  subscription_id: number | null;
  date_reserver: string;
  fin_prestation: string | null;
}

export interface AppointmentList {
  current_page: number;
  data: Appointment[];
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: SubscriptionList;
}
export interface Subscription {
  id: number;
  total_session: number;
  used_session: number;
  date_debut: string;
  date_fin: string;
  nomclient: string;
  email: string;
  phone: string;
  formule: string;
  service: string;
  prixservice: string;
  dure_minute: number;
  prixpromo:string;
}

export interface SubscriptionList {
  current_page: number;
  data: Subscription[];
}

export interface AppointAndSub {
  appointments : AppointmentList;
  subscriptions : SubscriptionList;
}

export interface AllAppointments {
  irdv : number ;
  date_reserver : string;
}

export interface Appointmentsall {
  success: boolean;
  message: string;
  data : AllAppointments[];
}

export const servicesService = {
  all: async (): Promise<ServicesWithEmployee> => {
    const response = await API.get<ServicesWithEmployee>('/service-category'); 
    return response.data;
  },

  book: async (payload: BookingPayload): Promise<BookingResponsePayement> => {
    try {
      const response = await API.post<BookingResponsePayement>('/appointments', payload);
      return response.data;
    } catch (error: any) {

      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Erreur lors de la réservation.");
      }
      throw error;
    }
  },


  login: async (payload: Login): Promise<BookingResponse> => {
  try {
      const response = await API.post<BookingResponse>('/client/login', payload);
      console.log("ettooo user ",response.data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  verificationcreneau: async (payload: BookingVerification): Promise<ResponseVerification> => {
  try {
      const response = await API.post<ResponseVerification>('/checkcreneau', payload);
      console.log("verification ",response.data);
      return response.data;
      
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  appointandsub: async (): Promise<AppointAndSub> => {
    const userId = localStorage.getItem('user_id');
    console.log("user",userId);
    const [appointmentsRes, subscriptionsRes] = await Promise.all([
      API.get<AppointmentResponse>(`/appointments/client/${userId}`),
      API.get<SubscriptionResponse>(`/subscription/client/${userId}`)
    ]);
    return {
      appointments: appointmentsRes.data.data,
      subscriptions: subscriptionsRes.data.data
    };
  },

  allappointments : async (): Promise<Appointmentsall> => {
    const response = await API.get<Appointmentsall>('/appointmentsall'); 
    console.log("all rdv",response.data);
    return response.data;
  },

  pay: async (payload: Paiement): Promise<ValidateResponsePaiement> => {
  try {
      const response = await API.post<ValidateResponsePaiement>('/mvola', payload);
      return response.data;

    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
  
  checkAdress: async (payload: string): Promise<boolean> => {
    const value = payload.trim();
    const onlyNumbers = /^[0-9]+$/.test(value);
    const hasLetter = /[A-Za-z]/.test(value);
    return hasLetter && !onlyNumbers;
  },

  checkEmailFormat: async (email: string): Promise<boolean> => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  },
  checkPhoneNumber: async (phone: string): Promise<boolean> => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return false;
    const prefixes = ['034', '038', '037', '032', '033'];
    return prefixes.some(prefix => cleaned.startsWith(prefix));
  }



};
