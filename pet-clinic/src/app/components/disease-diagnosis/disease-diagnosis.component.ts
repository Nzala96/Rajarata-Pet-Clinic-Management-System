import { Component, OnInit } from '@angular/core';
import { DiseaseDiagnosisService } from '../../services/disease-diagnosis.service';
import { 
  Disease, 
  Symptom, 
  DiagnosisResult, 
  DiagnosisRequest, 
  PetType, 
  DiseaseCategory,
  SymptomCategory
} from '../../models/disease.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-disease-diagnosis',
  templateUrl: './disease-diagnosis.component.html',
  styleUrls: ['./disease-diagnosis.component.scss']
})
export class DiseaseDiagnosisComponent implements OnInit {
  // Form data
  diagnosisRequest: DiagnosisRequest = {
    petType: 'Dog',
    symptoms: [],
    age: undefined,
    weight: undefined,
    breed: '',
    duration: '',
    additionalNotes: ''
  };

  // Available options
  petTypes: PetType[] = [];
  symptoms: Symptom[] = [];
  filteredSymptoms: Symptom[] = [];
  diseaseCategories: DiseaseCategory[] = [];
  symptomCategories: SymptomCategory[] = [];

  // Diagnosis results
  diagnosisResults: DiagnosisResult[] = [];
  isLoading = false;
  hasResults = false;

  // UI state
  selectedSymptomCategory: SymptomCategory | '' = '';
  symptomSearchTerm = '';
  showAdvancedOptions = false;

  // Selected symptoms
  selectedSymptoms: string[] = [];

  constructor(
    private diseaseService: DiseaseDiagnosisService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.petTypes = this.diseaseService.getPetTypes();
    this.diseaseCategories = this.diseaseService.getDiseaseCategories();
    this.symptomCategories = this.diseaseService.getSymptomCategories();
    this.loadSymptoms();
  }

  loadSymptoms(): void {
    this.diseaseService.getSymptoms(this.diagnosisRequest.petType).subscribe({
      next: (symptoms) => {
        this.symptoms = symptoms;
        this.filteredSymptoms = symptoms;
      },
      error: (error) => {
        console.error('Error loading symptoms:', error);
        this.toastr.error('Failed to load symptoms', 'Error');
      }
    });
  }

  onPetTypeChange(): void {
    this.loadSymptoms();
    this.selectedSymptoms = [];
    this.diagnosisResults = [];
    this.hasResults = false;
  }

  onSymptomCategoryChange(): void {
    this.filterSymptoms();
  }

  onSymptomSearch(): void {
    this.filterSymptoms();
  }

  filterSymptoms(): void {
    let filtered = this.symptoms;

    // Filter by category
    if (this.selectedSymptomCategory) {
      filtered = filtered.filter(s => s.category === this.selectedSymptomCategory);
    }

    // Filter by search term
    if (this.symptomSearchTerm) {
      const searchTerm = this.symptomSearchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredSymptoms = filtered;
  }

  toggleSymptom(symptomName: string): void {
    const index = this.selectedSymptoms.indexOf(symptomName);
    if (index > -1) {
      this.selectedSymptoms.splice(index, 1);
    } else {
      this.selectedSymptoms.push(symptomName);
    }
  }

  isSymptomSelected(symptomName: string): boolean {
    return this.selectedSymptoms.includes(symptomName);
  }

  addCustomSymptom(): void {
    const customSymptom = this.symptomSearchTerm.trim();
    if (customSymptom && !this.selectedSymptoms.includes(customSymptom)) {
      this.selectedSymptoms.push(customSymptom);
      this.symptomSearchTerm = '';
      this.filterSymptoms();
    }
  }

  removeSymptom(symptom: string): void {
    const index = this.selectedSymptoms.indexOf(symptom);
    if (index > -1) {
      this.selectedSymptoms.splice(index, 1);
    }
  }

  performDiagnosis(): void {
    if (this.selectedSymptoms.length === 0) {
      this.toastr.warning('Please select at least one symptom', 'Warning');
      return;
    }

    this.isLoading = true;
    this.hasResults = false;

    const request: DiagnosisRequest = {
      ...this.diagnosisRequest,
      symptoms: this.selectedSymptoms
    };

    this.diseaseService.performDiagnosis(request).subscribe({
      next: (results) => {
        this.diagnosisResults = results;
        this.hasResults = true;
        this.isLoading = false;

        if (results.length === 0) {
          this.toastr.info('No matching diseases found for the selected symptoms', 'No Results');
        } else {
          this.toastr.success(`Found ${results.length} potential diagnosis(es)`, 'Diagnosis Complete');
        }
      },
      error: (error) => {
        console.error('Error performing diagnosis:', error);
        this.toastr.error('Failed to perform diagnosis', 'Error');
        this.isLoading = false;
      }
    });
  }

  clearDiagnosis(): void {
    this.selectedSymptoms = [];
    this.diagnosisResults = [];
    this.hasResults = false;
    this.symptomSearchTerm = '';
    this.selectedSymptomCategory = '';
    this.filterSymptoms();
  }

  getUrgencyClass(urgency: string): string {
    switch (urgency) {
      case 'Emergency': return 'text-danger fw-bold';
      case 'High': return 'text-warning fw-bold';
      case 'Medium': return 'text-info';
      case 'Low': return 'text-success';
      default: return 'text-muted';
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'Critical': return 'badge bg-danger';
      case 'High': return 'badge bg-warning text-dark';
      case 'Medium': return 'badge bg-info';
      case 'Low': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 80) return 'text-success fw-bold';
    if (confidence >= 60) return 'text-warning fw-bold';
    if (confidence >= 40) return 'text-info';
    return 'text-muted';
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) {
      return 'Cost not specified';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  }

  toggleAdvancedOptions(): void {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }
} 