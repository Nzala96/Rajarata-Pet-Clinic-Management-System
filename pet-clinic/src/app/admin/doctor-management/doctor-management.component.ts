import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, CreateDoctorRequest, UpdateDoctorRequest, DoctorSearchFilters } from '../../models/doctor.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-doctor-management',
  templateUrl: './doctor-management.component.html',
  styleUrls: ['./doctor-management.component.scss']
})
export class DoctorManagementComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  specializations: string[] = [];
  
  // Loading states
  isLoading = false;
  isCreating = false;
  isUpdating = false;
  isDeleting = false;
  
  // Search and filter
  searchFilters: DoctorSearchFilters = {};
  searchTerm = '';
  selectedSpecialization = '';
  availabilityFilter = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Modal states
  showCreateModal = false;
  showDeleteModal = false;
  
  // Current doctor for editing/viewing/deleting
  currentDoctor: Doctor | null = null;
  
  // Form data
  createForm: CreateDoctorRequest = {
    dname: '',
    demail: '',
    dtp: '',
    specialization: '',
    experience: 0,
    education: '',
    available: true
  };
  

  
  // User info
  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';

  constructor(
    private doctorService: DoctorService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();
    
    this.loadDoctors();
    this.loadSpecializations();
  }

  // Load doctors
  loadDoctors(): void {
    this.isLoading = true;
    console.log('Loading doctors from API...');
    
    this.doctorService.getDoctors().subscribe(
      (doctors) => {
        console.log('Doctors loaded successfully:', doctors);
        this.doctors = doctors;
        this.filteredDoctors = doctors;
        this.totalItems = doctors.length;
        this.isLoading = false;
        
        if (doctors.length === 0) {
          this.toastr.info('No doctors found in the database', 'Info');
        } else {
          this.toastr.success(`Loaded ${doctors.length} doctors`, 'Success');
        }
      },
      (error) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Failed to load doctors. Please check if the backend server is running.', 'Error');
        this.isLoading = false;
      }
    );
  }

  // Load specializations
  loadSpecializations(): void {
    this.specializations = this.doctorService.getSpecializations();
  }

  // Search and filter
  applyFilters(): void {
    this.searchFilters = {
      search: this.searchTerm,
      specialization: this.selectedSpecialization || undefined,
      available: this.availabilityFilter === 'true' ? true : 
                this.availabilityFilter === 'false' ? false : undefined
    };

    this.doctorService.searchDoctors(this.searchFilters).subscribe(
      (filteredDoctors) => {
        this.filteredDoctors = filteredDoctors;
        this.totalItems = filteredDoctors.length;
        this.currentPage = 1;
      }
    );
  }

  // Clear filters
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSpecialization = '';
    this.availabilityFilter = '';
    this.searchFilters = {};
    this.filteredDoctors = this.doctors;
    this.totalItems = this.doctors.length;
    this.currentPage = 1;
  }

  // Pagination
  get paginatedDoctors(): Doctor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDoctors.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Modal management
  openCreateModal(): void {
    this.resetCreateForm();
    this.showCreateModal = true;
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('createDoctorModal')!);
      modal.show();
    }, 100);
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetCreateForm();
  }





  openDeleteModal(doctor: Doctor): void {
    this.currentDoctor = doctor;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.currentDoctor = null;
  }

  // CRUD Operations
  createDoctor(): void {
    if (this.isCreating) return;
    
    this.isCreating = true;
    this.doctorService.createDoctor(this.createForm).subscribe(
      (response) => {
        this.toastr.success('Doctor created successfully!', 'Success');
        this.closeCreateModal();
        this.loadDoctors();
        this.isCreating = false;
      },
      (error) => {
        console.error('Error creating doctor:', error);
        this.toastr.error('Failed to create doctor', 'Error');
        this.isCreating = false;
      }
    );
  }



  deleteDoctor(): void {
    if (this.isDeleting || !this.currentDoctor?.id) return;
    
    this.isDeleting = true;
    this.doctorService.deleteDoctor(this.currentDoctor.id).subscribe(
      (response) => {
        this.toastr.success('Doctor deleted successfully!', 'Success');
        this.closeDeleteModal();
        this.loadDoctors();
        this.isDeleting = false;
      },
      (error) => {
        console.error('Error deleting doctor:', error);
        this.toastr.error('Failed to delete doctor', 'Error');
        this.isDeleting = false;
      }
    );
  }

  // Helper methods
  resetCreateForm(): void {
    this.createForm = {
      dname: '',
      demail: '',
      dtp: '',
      specialization: '',
      experience: 0,
      education: '',
      available: true
    };
  }

  getStatusBadgeClass(available: boolean | undefined): string {
    return available ? 'badge bg-success' : 'badge bg-secondary';
  }

  getStatusText(available: boolean | undefined): string {
    return available ? 'Available' : 'Unavailable';
  }

  // Export functionality
  exportDoctors(): void {
    const csvData = this.convertToCSV(this.filteredDoctors);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'doctors.csv');
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(doctors: Doctor[]): string {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Specialization', 'Experience', 'Education', 'Available'];
    const rows = doctors.map(doctor => [
      doctor.id || '',
      doctor.dname || '',
      doctor.demail || '',
      doctor.dtp || '',
      doctor.specialization || '',
      doctor.experience || '',
      doctor.education || '',
      doctor.available ? 'Yes' : 'No'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Track by function for ngFor performance
  trackByDoctorId(index: number, doctor: Doctor): any {
    return doctor.id || index;
  }

  // Math object for template access
  Math = Math;
} 