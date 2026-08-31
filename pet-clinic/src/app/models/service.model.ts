export interface Service {
  id?: number;
  name: string;
  description?: string;
  price: number;
  // duration: number; 
  // category: string;
  available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceSearchFilters {
  search?: string;
  // category?: string;
  available?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  // duration: number;
  // category: string;
  available?: boolean;
}

export interface UpdateServiceRequest {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  // duration?: number;
  // category?: string;
  available?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'medical', name: 'Medical Services', description: 'Medical treatments and procedures' },
  { id: 'vaccination', name: 'Vaccination', description: 'Preventive vaccination services' },
  { id: 'surgery', name: 'Surgery', description: 'Surgical procedures and operations' },
  { id: 'grooming', name: 'Grooming', description: 'Pet grooming and hygiene services' },
  { id: 'dental', name: 'Dental Care', description: 'Dental cleaning and oral health' },
  { id: 'emergency', name: 'Emergency Services', description: 'Emergency medical care' },
  { id: 'wellness', name: 'Wellness Check', description: 'Regular health checkups' },
  { id: 'laboratory', name: 'Laboratory Tests', description: 'Diagnostic tests and analysis' },
  { id: 'consultation', name: 'Consultation', description: 'Professional consultation services' },
  { id: 'boarding', name: 'Boarding', description: 'Pet boarding and daycare services' }
]; 