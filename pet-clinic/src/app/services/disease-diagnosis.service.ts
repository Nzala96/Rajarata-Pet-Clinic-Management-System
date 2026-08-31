import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
  Disease, 
  Symptom, 
  DiagnosisResult, 
  DiagnosisRequest, 
  PetType, 
  DiseaseCategory,
  SymptomCategory,
  TreatmentType,
  DiseaseSearchFilters
} from '../models/disease.model';

@Injectable({
  providedIn: 'root'
})
export class DiseaseDiagnosisService {
  private apiUrl = 'http://localhost:8000/api';

  // Sample diseases database
  private diseases: Disease[] = [
    {
      id: 1,
      name: 'Canine Parvovirus',
      description: 'A highly contagious viral disease that affects dogs, especially puppies.',
      symptoms: ['Vomiting', 'Diarrhea', 'Lethargy', 'Loss of appetite', 'Fever', 'Dehydration'],
      severity: 'High',
      petTypes: ['Dog'],
      treatments: [
        {
          id: 1,
          name: 'Fluid Therapy',
          description: 'Intravenous fluids to prevent dehydration',
          type: 'Medication',
          duration: '3-7 days',
          effectiveness: 85,
          requiresVet: true
        },
        {
          id: 2,
          name: 'Antibiotics',
          description: 'To prevent secondary bacterial infections',
          type: 'Medication',
          duration: '7-10 days',
          effectiveness: 70,
          requiresVet: true
        }
      ],
      prevention: ['Vaccination', 'Good hygiene', 'Avoid contact with infected dogs'],
      contagious: true,
      incubationPeriod: '3-7 days',
      recoveryTime: '1-2 weeks',
      mortalityRate: 20,
      category: 'Infectious'
    },
    {
      id: 2,
      name: 'Feline Upper Respiratory Infection',
      description: 'Common viral infection affecting cats\' respiratory system.',
      symptoms: ['Sneezing', 'Runny nose', 'Watery eyes', 'Coughing', 'Loss of appetite', 'Fever'],
      severity: 'Medium',
      petTypes: ['Cat'],
      treatments: [
        {
          id: 3,
          name: 'Antiviral Medication',
          description: 'To reduce viral replication',
          type: 'Medication',
          duration: '7-14 days',
          effectiveness: 75,
          requiresVet: true
        },
        {
          id: 4,
          name: 'Steam Therapy',
          description: 'Humidified air to help breathing',
          type: 'Environmental',
          duration: 'As needed',
          effectiveness: 60,
          requiresVet: false
        }
      ],
      prevention: ['Vaccination', 'Indoor living', 'Good ventilation'],
      contagious: true,
      incubationPeriod: '2-10 days',
      recoveryTime: '1-3 weeks',
      category: 'Infectious'
    },
    {
      id: 3,
      name: 'Obesity',
      description: 'Excessive body weight that can lead to various health problems.',
      symptoms: ['Weight gain', 'Difficulty breathing', 'Lethargy', 'Joint problems', 'Reduced activity'],
      severity: 'Medium',
      petTypes: ['Dog', 'Cat'],
      treatments: [
        {
          id: 5,
          name: 'Diet Management',
          description: 'Controlled calorie intake with balanced nutrition',
          type: 'Diet',
          duration: 'Lifetime',
          effectiveness: 90,
          requiresVet: false
        },
        {
          id: 6,
          name: 'Exercise Program',
          description: 'Gradual increase in physical activity',
          type: 'Exercise',
          duration: 'Lifetime',
          effectiveness: 85,
          requiresVet: false
        }
      ],
      prevention: ['Balanced diet', 'Regular exercise', 'Portion control'],
      contagious: false,
      recoveryTime: '6-12 months',
      category: 'Nutritional'
    },
    {
      id: 4,
      name: 'Dental Disease',
      description: 'Inflammation and infection of the gums and teeth.',
      symptoms: ['Bad breath', 'Red or swollen gums', 'Difficulty eating', 'Drooling', 'Pawing at mouth'],
      severity: 'Medium',
      petTypes: ['Dog', 'Cat'],
      treatments: [
        {
          id: 7,
          name: 'Dental Cleaning',
          description: 'Professional cleaning under anesthesia',
          type: 'Surgery',
          duration: '1 day',
          effectiveness: 95,
          requiresVet: true
        },
        {
          id: 8,
          name: 'Home Dental Care',
          description: 'Regular brushing and dental chews',
          type: 'Preventive',
          duration: 'Lifetime',
          effectiveness: 80,
          requiresVet: false
        }
      ],
      prevention: ['Regular brushing', 'Dental chews', 'Annual checkups'],
      contagious: false,
      category: 'Dental'
    },
    {
      id: 5,
      name: 'Skin Allergies',
      description: 'Allergic reactions causing skin irritation and itching.',
      symptoms: ['Itching', 'Red skin', 'Hair loss', 'Scabs', 'Ear infections', 'Licking paws'],
      severity: 'Low',
      petTypes: ['Dog', 'Cat'],
      treatments: [
        {
          id: 9,
          name: 'Antihistamines',
          description: 'To reduce allergic reactions',
          type: 'Medication',
          duration: 'As needed',
          effectiveness: 70,
          requiresVet: true
        },
        {
          id: 10,
          name: 'Allergen Avoidance',
          description: 'Identify and avoid triggering allergens',
          type: 'Environmental',
          duration: 'Lifetime',
          effectiveness: 85,
          requiresVet: false
        }
      ],
      prevention: ['Regular grooming', 'Hypoallergenic diet', 'Clean environment'],
      contagious: false,
      category: 'Skin'
    }
  ];

  // Sample symptoms database
  private symptoms: Symptom[] = [
    { id: 1, name: 'Vomiting', description: 'Forceful expulsion of stomach contents', severity: 'Moderate', category: 'Digestive', relatedDiseases: [1], petTypes: ['Dog', 'Cat'] },
    { id: 2, name: 'Diarrhea', description: 'Loose or watery stools', severity: 'Moderate', category: 'Digestive', relatedDiseases: [1], petTypes: ['Dog', 'Cat'] },
    { id: 3, name: 'Lethargy', description: 'Lack of energy or enthusiasm', severity: 'Mild', category: 'General', relatedDiseases: [1, 3], petTypes: ['Dog', 'Cat'] },
    { id: 4, name: 'Loss of appetite', description: 'Reduced or no interest in food', severity: 'Moderate', category: 'General', relatedDiseases: [1, 2], petTypes: ['Dog', 'Cat'] },
    { id: 5, name: 'Sneezing', description: 'Sudden expulsion of air through nose', severity: 'Mild', category: 'Respiratory', relatedDiseases: [2], petTypes: ['Cat'] },
    { id: 6, name: 'Runny nose', description: 'Excessive nasal discharge', severity: 'Mild', category: 'Respiratory', relatedDiseases: [2], petTypes: ['Cat'] },
    { id: 7, name: 'Weight gain', description: 'Increase in body weight', severity: 'Mild', category: 'Physical', relatedDiseases: [3], petTypes: ['Dog', 'Cat'] },
    { id: 8, name: 'Itching', description: 'Persistent scratching or licking', severity: 'Mild', category: 'Skin', relatedDiseases: [5], petTypes: ['Dog', 'Cat'] },
    { id: 9, name: 'Bad breath', description: 'Unpleasant odor from mouth', severity: 'Mild', category: 'Dental', relatedDiseases: [4], petTypes: ['Dog', 'Cat'] },
    { id: 10, name: 'Red skin', description: 'Inflammation or redness of skin', severity: 'Moderate', category: 'Skin', relatedDiseases: [5], petTypes: ['Dog', 'Cat'] }
  ];

  constructor() { }

  // Get all diseases
  getDiseases(filters?: DiseaseSearchFilters): Observable<Disease[]> {
    let filteredDiseases = this.diseases;

    if (filters) {
      if (filters.petType) {
        filteredDiseases = filteredDiseases.filter(d => d.petTypes.includes(filters.petType!));
      }
      if (filters.category) {
        filteredDiseases = filteredDiseases.filter(d => d.category === filters.category);
      }
      if (filters.severity) {
        filteredDiseases = filteredDiseases.filter(d => d.severity === filters.severity);
      }
      if (filters.contagious !== undefined) {
        filteredDiseases = filteredDiseases.filter(d => d.contagious === filters.contagious);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredDiseases = filteredDiseases.filter(d => 
          d.name.toLowerCase().includes(searchTerm) ||
          d.description.toLowerCase().includes(searchTerm) ||
          d.symptoms.some(s => s.toLowerCase().includes(searchTerm))
        );
      }
    }

    return of(filteredDiseases).pipe(delay(500)); // Simulate API delay
  }

  // Get disease by ID
  getDiseaseById(id: number): Observable<Disease | null> {
    const disease = this.diseases.find(d => d.id === id);
    return of(disease || null).pipe(delay(300));
  }

  // Get all symptoms
  getSymptoms(petType?: PetType): Observable<Symptom[]> {
    let filteredSymptoms = this.symptoms;
    
    if (petType) {
      filteredSymptoms = filteredSymptoms.filter(s => s.petTypes.includes(petType));
    }

    return of(filteredSymptoms).pipe(delay(300));
  }

  // Perform diagnosis
  performDiagnosis(request: DiagnosisRequest): Observable<DiagnosisResult[]> {
    const results: DiagnosisResult[] = [];

    // Find diseases that match the pet type
    const relevantDiseases = this.diseases.filter(d => d.petTypes.includes(request.petType));

    for (const disease of relevantDiseases) {
      const matchedSymptoms = disease.symptoms.filter(symptom => 
        request.symptoms.some(inputSymptom => 
          inputSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(inputSymptom.toLowerCase())
        )
      );

      const missingSymptoms = disease.symptoms.filter(symptom => 
        !matchedSymptoms.includes(symptom)
      );

      if (matchedSymptoms.length > 0) {
        const confidence = (matchedSymptoms.length / disease.symptoms.length) * 100;
        
        // Adjust confidence based on symptom severity and additional factors
        let adjustedConfidence = confidence;
        
        // Age factor for certain diseases
        if (request.age && disease.name.includes('Parvovirus') && request.age < 1) {
          adjustedConfidence += 10;
        }

        // Weight factor for obesity
        if (disease.name === 'Obesity' && request.weight && request.weight > 50) {
          adjustedConfidence += 15;
        }

        // Cap confidence at 100%
        adjustedConfidence = Math.min(adjustedConfidence, 100);

        const urgency = this.calculateUrgency(disease.severity, adjustedConfidence, matchedSymptoms.length);
        
        const recommendedActions = this.generateRecommendedActions(disease, adjustedConfidence, urgency);

        results.push({
          disease,
          confidence: Math.round(adjustedConfidence),
          matchedSymptoms,
          missingSymptoms,
          recommendedActions,
          urgency
        });
      }
    }

    // Sort by confidence (highest first)
    results.sort((a, b) => b.confidence - a.confidence);

    return of(results).pipe(delay(1000)); // Simulate diagnosis processing time
  }

  // Calculate urgency level
  private calculateUrgency(severity: string, confidence: number, matchedSymptoms: number): 'Low' | 'Medium' | 'High' | 'Emergency' {
    if (severity === 'Critical' && confidence > 70) return 'Emergency';
    if (severity === 'High' && confidence > 60) return 'High';
    if (severity === 'Medium' && confidence > 50) return 'Medium';
    if (severity === 'Low' && confidence > 40) return 'Low';
    
    // Default based on severity
    switch (severity) {
      case 'Critical': return 'High';
      case 'High': return 'Medium';
      case 'Medium': return 'Low';
      default: return 'Low';
    }
  }

  // Generate recommended actions
  private generateRecommendedActions(disease: Disease, confidence: number, urgency: string): string[] {
    const actions: string[] = [];

    if (confidence > 80) {
      actions.push(`High probability of ${disease.name} - Immediate veterinary consultation recommended`);
    } else if (confidence > 60) {
      actions.push(`Moderate probability of ${disease.name} - Schedule veterinary appointment soon`);
    } else {
      actions.push(`Low probability of ${disease.name} - Monitor symptoms and consult vet if condition worsens`);
    }

    if (urgency === 'Emergency') {
      actions.push('URGENT: Seek immediate veterinary care');
    } else if (urgency === 'High') {
      actions.push('Schedule veterinary appointment within 24 hours');
    } else if (urgency === 'Medium') {
      actions.push('Schedule veterinary appointment within 48-72 hours');
    }

    if (disease.contagious) {
      actions.push('Isolate pet from other animals - this condition is contagious');
    }

    // Add treatment recommendations
    if (disease.treatments.length > 0) {
      const primaryTreatment = disease.treatments[0];
      actions.push(`Primary treatment: ${primaryTreatment.name} (${primaryTreatment.description})`);
    }

    // Add prevention tips
    if (disease.prevention.length > 0) {
      actions.push(`Prevention: ${disease.prevention.join(', ')}`);
    }

    return actions;
  }

  // Get disease categories
  getDiseaseCategories(): DiseaseCategory[] {
    return [
      'Infectious', 'Parasitic', 'Nutritional', 'Genetic', 'Environmental',
      'Behavioral', 'Dental', 'Cardiovascular', 'Respiratory', 'Digestive',
      'Neurological', 'Skin', 'Urinary', 'Reproductive', 'Musculoskeletal'
    ];
  }

  // Get symptom categories
  getSymptomCategories(): SymptomCategory[] {
    return [
      'Behavioral', 'Physical', 'Digestive', 'Respiratory', 'Neurological',
      'Skin', 'Urinary', 'Reproductive', 'Musculoskeletal', 'Dental', 'General'
    ];
  }

  // Get pet types
  getPetTypes(): PetType[] {
    return ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
  }

  // Search symptoms
  searchSymptoms(query: string, petType?: PetType): Observable<Symptom[]> {
    let filteredSymptoms = this.symptoms;
    
    if (petType) {
      filteredSymptoms = filteredSymptoms.filter(s => s.petTypes.includes(petType));
    }

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredSymptoms = filteredSymptoms.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm)
      );
    }

    return of(filteredSymptoms).pipe(delay(300));
  }
} 