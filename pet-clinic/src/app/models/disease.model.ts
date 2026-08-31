export interface Disease {
  id: number;
  name: string;
  description: string;
  symptoms: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  petTypes: PetType[];
  treatments: Treatment[];
  prevention: string[];
  contagious: boolean;
  incubationPeriod?: string;
  recoveryTime?: string;
  mortalityRate?: number;
  imageUrl?: string;
  category: DiseaseCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface Symptom {
  id: number;
  name: string;
  description: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  category: SymptomCategory;
  relatedDiseases: number[]; // Disease IDs
  petTypes: PetType[];
}

export interface Treatment {
  id: number;
  name: string;
  description: string;
  type: TreatmentType;
  duration: string;
  cost?: number; // Made optional
  effectiveness: number; // Percentage
  sideEffects?: string[];
  requiresVet: boolean;
}

export interface DiagnosisResult {
  disease: Disease;
  confidence: number; // Percentage match
  matchedSymptoms: string[];
  missingSymptoms: string[];
  recommendedActions: string[];
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
}

export interface DiagnosisRequest {
  petType: PetType;
  symptoms: string[];
  age?: number;
  weight?: number;
  breed?: string;
  duration?: string;
  additionalNotes?: string;
}

export type PetType = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Hamster' | 'Fish' | 'Reptile' | 'Other';

export type DiseaseCategory = 
  | 'Infectious' 
  | 'Parasitic' 
  | 'Nutritional' 
  | 'Genetic' 
  | 'Environmental' 
  | 'Behavioral' 
  | 'Dental' 
  | 'Cardiovascular' 
  | 'Respiratory' 
  | 'Digestive' 
  | 'Neurological' 
  | 'Skin' 
  | 'Urinary' 
  | 'Reproductive' 
  | 'Musculoskeletal';

export type SymptomCategory = 
  | 'Behavioral' 
  | 'Physical' 
  | 'Digestive' 
  | 'Respiratory' 
  | 'Neurological' 
  | 'Skin' 
  | 'Urinary' 
  | 'Reproductive' 
  | 'Musculoskeletal' 
  | 'Dental'
  | 'General';

export type TreatmentType = 
  | 'Medication' 
  | 'Surgery' 
  | 'Diet' 
  | 'Exercise' 
  | 'Environmental' 
  | 'Behavioral' 
  | 'Alternative' 
  | 'Preventive';

export interface DiseaseSearchFilters {
  petType?: PetType;
  category?: DiseaseCategory;
  severity?: string;
  contagious?: boolean;
  search?: string;
} 