export interface Doctor {
  id?: number;
  dname: string;
  demail: string;
  dtp: string;
  specialization?: string;
  experience?: number;
  education?: string;
  available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DoctorSearchFilters {
  search?: string;
  specialization?: string;
  available?: boolean;
}

export interface CreateDoctorRequest {
  dname: string;
  demail: string;
  dtp: string;
  specialization?: string;
  experience?: number;
  education?: string;
  available?: boolean;
}

export interface UpdateDoctorRequest {
  id: number;
  dname?: string;
  demail?: string;
  dtp?: string;
  specialization?: string;
  experience?: number;
  education?: string;
  available?: boolean;
} 