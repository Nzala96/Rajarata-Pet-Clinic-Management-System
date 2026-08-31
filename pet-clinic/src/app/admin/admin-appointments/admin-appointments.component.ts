import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardService, AdminAppointment, AppointmentFilters, CreateAppointmentRequest, UpdateAppointmentRequest } from '../../services/admin-dashboard.service';
import { DoctorService } from '../../services/doctor.service';
import { ServiceService } from '../../services/service.service';
import { Doctor } from '../../models/doctor.model';
import { Service } from '../../models/service.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-appointments',
  templateUrl: './admin-appointments.component.html',
  styleUrls: ['./admin-appointments.component.scss']
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: AdminAppointment[] = [];
  filteredAppointments: AdminAppointment[] = [];
  doctors: Doctor[] = [];
  services: Service[] = [];
  
  // Loading states
  isLoading = false;
  isCreating = false;
  isUpdating = false;
  isLoadingServices = false;
  
  // Filters
  filters: AppointmentFilters = {};
  statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Modal states
  showCreateModal = false;
  showDeleteModal = false;
  
  // Current appointment for editing/deleting
  currentAppointment: AdminAppointment | null = null;
  
  // Form data
  appointmentForm: CreateAppointmentRequest = {
    date: '',
    time: '',
    petname: '',
    docname: '',
    name: '',
    email: '',
    contactNumber: '',
    appointmentType: '',
    notes: '',
    petAge: '',
    petBreed: '',
    reasonForVisit: ''
  };
  
  // Edit form data
  editForm: UpdateAppointmentRequest = {};
  
  // Search and filter form
  searchTerm = '';
  dateFrom = '';
  dateTo = '';
  selectedStatus = '';
  selectedDoctor = '';
  
  constructor(
    private adminService: AdminDashboardService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
    this.loadServices();
    
    // Add ESC key listener to close modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeCreateModal();
        this.closeDeleteModal();
      }
    });
  }

  // ============ DATA LOADING ============

  loadAppointments(): void {
    this.isLoading = true;
    this.adminService.getAllAppointments(this.filters).subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.applyFilters();
        this.isLoading = false;
        console.log('Appointments loaded:', appointments.length);
      },
      (error) => {
        console.error('Error loading appointments:', error);
        this.toastr.error('Failed to load appointments', 'Error');
        this.isLoading = false;
      }
    );
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors) => {
        this.doctors = doctors;
        console.log('Doctors loaded:', doctors.length);
      },
      (error) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Failed to load doctors', 'Error');
      }
    );
  }

  loadServices(): void {
    this.isLoadingServices = true;
    this.serviceService.getServices().subscribe(
      (services) => {
        this.services = services;
        this.isLoadingServices = false;
        console.log('Services loaded:', services.length);
      },
      (error) => {
        console.error('Error loading services:', error);
        this.toastr.error('Failed to load services', 'Error');
        this.isLoadingServices = false;
      }
    );
  }

  // ============ FILTERING & SEARCH ============

  applyFilters(): void {
    this.filters = {
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined,
      status: this.selectedStatus || undefined,
      doctor: this.selectedDoctor || undefined,
      searchTerm: this.searchTerm || undefined
    };
    
    this.filteredAppointments = this.appointments.filter(appointment => {
      // Date range filter
      if (this.dateFrom && appointment.date < this.dateFrom) return false;
      if (this.dateTo && appointment.date > this.dateTo) return false;
      
      // Status filter
      if (this.selectedStatus && appointment.status !== this.selectedStatus) return false;
      
      // Doctor filter
      if (this.selectedDoctor && !appointment.docname.toLowerCase().includes(this.selectedDoctor.toLowerCase())) return false;
      
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return appointment.name.toLowerCase().includes(searchLower) ||
               appointment.petname.toLowerCase().includes(searchLower) ||
               appointment.email.toLowerCase().includes(searchLower) ||
               appointment.docname.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
    
    this.totalItems = this.filteredAppointments.length;
    this.currentPage = 1; // Reset to first page
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.selectedStatus = '';
    this.selectedDoctor = '';
    this.filters = {};
    this.filteredAppointments = [...this.appointments];
    this.totalItems = this.filteredAppointments.length;
    this.currentPage = 1;
  }

  // ============ PAGINATION ============

  get paginatedAppointments(): AdminAppointment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAppointments.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ============ APPOINTMENT CRUD OPERATIONS ============

  // Create appointment
  openCreateModal(): void {
    this.resetAppointmentForm();
    this.showCreateModal = true;
    // Add modal backdrop and body class
    document.body.classList.add('modal-open');
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetAppointmentForm();
    // Remove modal backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
  }

  createAppointment(): void {
    if (!this.validateAppointmentForm()) {
      return;
    }

    this.isCreating = true;
    console.log(this.appointmentForm);
    this.adminService.createAppointment(this.appointmentForm).subscribe(
      (response) => {
        if (response.success !== false) {
          this.toastr.success('Appointment created successfully', 'Success');
          this.closeCreateModal();
          this.loadAppointments();
        } else {
          this.toastr.error(response.message || 'Failed to create appointment', 'Error');
        }
        this.isCreating = false;
      },
      (error) => {
        console.error('Error creating appointment:', error);
        this.toastr.error('Failed to create appointment', 'Error');
        this.isCreating = false;
      }
    );
  }

  // Delete appointment
  openDeleteModal(appointment: AdminAppointment): void {
    this.currentAppointment = appointment;
    this.showDeleteModal = true;
    // Add modal backdrop and body class
    document.body.classList.add('modal-open');
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.currentAppointment = null;
    // Remove modal backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
  }

  deleteAppointment(): void {
    if (!this.currentAppointment) return;

    this.adminService.deleteAppointment(this.currentAppointment.id).subscribe(
      (response) => {
        if (response.success !== false) {
          this.toastr.success('Appointment deleted successfully', 'Success');
          this.closeDeleteModal();
          this.loadAppointments();
        } else {
          this.toastr.error(response.message || 'Failed to delete appointment', 'Error');
        }
      },
      (error) => {
        console.error('Error deleting appointment:', error);
        this.toastr.error('Failed to delete appointment', 'Error');
      }
    );
  }

  // ============ STATUS MANAGEMENT ============

  updateAppointmentStatus(appointment: AdminAppointment, newStatus: string): void {
    // Prevent cancelling completed appointments
    if (newStatus === 'cancelled' && appointment.status === 'completed') {
      this.toastr.error('Cannot cancel completed appointments', 'Error');
      return;
    }

    this.adminService.updateAppointmentStatus(appointment.id, newStatus).subscribe(
      (response) => {
        if (response.success !== false) {
          appointment.status = newStatus as any;
          this.toastr.success(`Appointment ${newStatus} successfully`, 'Success');
        } else {
          this.toastr.error(response.message || 'Failed to update appointment status', 'Error');
        }
      },
      (error) => {
        console.error('Error updating appointment status:', error);
        this.toastr.error('Failed to update appointment status', 'Error');
      }
    );
  }

  // ============ UTILITY METHODS ============

  resetAppointmentForm(): void {
    this.appointmentForm = {
      date: '',
      time: '',
      petname: '',
      docname: '',
      name: '',
      email: '',
      contactNumber: '',
      appointmentType: '',
      notes: '',
      petAge: '',
      petBreed: '',
      reasonForVisit: ''
    };
  }

  validateAppointmentForm(): boolean {
    if (!this.appointmentForm.date || !this.appointmentForm.time || 
        !this.appointmentForm.petname || !this.appointmentForm.docname ||
        !this.appointmentForm.name || !this.appointmentForm.email) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.appointmentForm.email)) {
      this.toastr.error('Please enter a valid email address', 'Validation Error');
      return false;
    }
    
    return true;
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge bg-success';
      case 'completed':
        return 'badge bg-primary';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    
    // Handle different time formats
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    
    return timeString;
  }

  refreshAppointments(): void {
    this.loadAppointments();
  }

  exportAppointments(): void {
    // Implementation for exporting appointments to CSV/Excel
    this.toastr.info('Export functionality will be implemented soon', 'Info');
  }

  // Navigate to edit appointment page
  navigateToEditAppointment(appointment: AdminAppointment): void {
    if (!this.canEditAppointment(appointment)) {
      this.toastr.warning('This appointment cannot be edited', 'Warning');
      return;
    }
    this.router.navigate(['/admin/appointments/edit', appointment.id]);
  }

  // Check if appointment can be edited
  canEditAppointment(appointment: AdminAppointment): boolean {
    // Only pending appointments can be edited
    return appointment.status === 'pending';
  }

  // Check if appointment can be cancelled
  canCancelAppointment(appointment: AdminAppointment): boolean {
    // Only pending and confirmed appointments can be cancelled
    // Completed appointments cannot be cancelled
    return appointment.status === 'pending' || appointment.status === 'confirmed';
  }

  // Get tooltip for edit button
  getEditButtonTooltip(appointment: AdminAppointment): string {
    if (this.canEditAppointment(appointment)) {
      return 'Edit Appointment';
    }
    
    switch (appointment.status) {
      case 'confirmed':
        return 'Cannot edit confirmed appointments';
      case 'completed':
        return 'Cannot edit completed appointments';
      case 'cancelled':
        return 'Cannot edit cancelled appointments';
      default:
        return 'Cannot edit this appointment';
    }
  }

  // Get tooltip for cancel button
  getCancelButtonTooltip(appointment: AdminAppointment): string {
    if (this.canCancelAppointment(appointment)) {
      return 'Cancel Appointment';
    }
    
    switch (appointment.status) {
      case 'completed':
        return 'Cannot cancel completed appointments';
      case 'cancelled':
        return 'Appointment is already cancelled';
      default:
        return 'Cannot cancel this appointment';
    }
  }
} 