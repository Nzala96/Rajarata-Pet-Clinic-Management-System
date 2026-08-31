import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAppointmentService, UserAppointment, CreateUserAppointmentRequest, UpdateUserAppointmentRequest, Doctor } from '../../services/user-appointment.service';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { PetService } from '../../services/pet.service';
import { ServiceService } from '../../services/service.service';
import { UserService, UserProfile } from '../../services/user.service';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  owner: string;
}

interface Service {
  id?: number;
  name: string;
  description?: string;
  price: number;
  available?: boolean;
}

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss']
})
export class UserAppointmentsComponent implements OnInit {
  appointments: UserAppointment[] = [];
  filteredAppointments: UserAppointment[] = [];
  doctors: Doctor[] = [];
  userPets: Pet[] = [];
  services: Service[] = [];
  userProfile: UserProfile | null = null;
  
  // Loading states
  isLoading = false;
  isCreating = false;
  isUpdating = false;
  isCancelling = false;
  isLoadingPets = false;
  isLoadingServices = false;
  isLoadingProfile = false;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showCancelModal = false;
  
  // Current appointment for editing/cancelling
  currentAppointment: UserAppointment | null = null;
  
  // Form data
  appointmentForm: CreateUserAppointmentRequest = {
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
  editForm: UpdateUserAppointmentRequest = {};
  
  // Search and filter
  searchTerm = '';
  selectedStatus = '';
  statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];
  
  // User info
  userEmail: string = '';
  userName: string = '';
  
  constructor(
    private userAppointmentService: UserAppointmentService,
    private authService: AuthService,
    private toastr: ToastrService,
    private petService: PetService,
    private serviceService: ServiceService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail() || '';
    this.userName = this.authService.getUsername() || '';
    
    if (this.userEmail) {
      this.loadUserAppointments();
      this.loadDoctors();
      this.loadUserPets();
      this.loadServices();
      this.loadUserProfile();
      this.initializeForm();
    }
  }

  // ============ DATA LOADING ============

  loadUserAppointments(): void {
    this.isLoading = true;
    this.userAppointmentService.getUserAppointments(this.userEmail).subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.applyFilters();
        this.isLoading = false;
        console.log('User appointments loaded:', appointments.length);
      },
      (error) => {
        console.error('Error loading user appointments:', error);
        this.toastr.error('Failed to load appointments', 'Error');
        this.isLoading = false;
      }
    );
  }

  loadDoctors(): void {
    this.userAppointmentService.getDoctors().subscribe(
      (doctors) => {
        this.doctors = doctors;
        console.log('Doctors loaded:', doctors.length);
      },
      (error) => {
        console.error('Error loading doctors:', error);
      }
    );
  }

  loadUserPets(): void {
    this.isLoadingPets = true;
    this.petService.getPetsByUserEmail(this.userEmail).subscribe(
      (pets) => {
        this.userPets = pets;
        this.isLoadingPets = false;
        console.log('User pets loaded:', pets.length);
      },
      (error) => {
        console.error('Error loading user pets:', error);
        // Fallback to get all pets and filter
        this.petService.getPets().subscribe((allPets) => {
          this.userPets = allPets.filter(pet => pet.owner === this.userEmail);
          this.isLoadingPets = false;
        });
      }
    );
  }

  loadServices(): void {
    this.isLoadingServices = true;
    this.serviceService.getServices().subscribe(
      (services) => {
        this.services = services.filter(service => service.available !== false);
        this.isLoadingServices = false;
        console.log('Services loaded:', services.length);
      },
      (error) => {
        console.error('Error loading services:', error);
        this.isLoadingServices = false;
      }
    );
  }

  loadUserProfile(): void {
    this.isLoadingProfile = true;
    this.userService.getUserProfile(this.userEmail).subscribe(
      (profile) => {
        this.userProfile = profile;
        this.isLoadingProfile = false;
        console.log('User profile loaded:', profile);
      },
      (error) => {
        console.error('Error loading user profile:', error);
        this.isLoadingProfile = false;
      }
    );
  }

  // ============ PET SELECTION & AUTO-FILL ============

  onPetSelected(petName: string | undefined): void {
    if (!petName) return;
    
    const selectedPet = this.userPets.find(pet => pet.name === petName);
    if (selectedPet) {
      // Auto-fill pet details
      this.appointmentForm.petAge = selectedPet.age.toString();
      this.appointmentForm.petBreed = selectedPet.breed;
      
      // Auto-fill user details if available
      if (this.userProfile) {
        this.appointmentForm.contactNumber = this.userProfile.phone || this.userProfile.contactNumber || '';
      }
    }
  }

  onEditPetSelected(petName: string | undefined): void {
    if (!petName) return;
    
    const selectedPet = this.userPets.find(pet => pet.name === petName);
    if (selectedPet) {
      // Auto-fill pet details for edit form
      this.editForm.petAge = selectedPet.age.toString();
      this.editForm.petBreed = selectedPet.breed;
    }
  }

  // ============ FILTERING & SEARCH ============

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      // Status filter
      if (this.selectedStatus && appointment.status !== this.selectedStatus) return false;
      
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return appointment.petname.toLowerCase().includes(searchLower) ||
               appointment.docname.toLowerCase().includes(searchLower) ||
               appointment.appointmentType?.toLowerCase().includes(searchLower) ||
               appointment.reasonForVisit?.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filteredAppointments = [...this.appointments];
  }

  // ============ APPOINTMENT CRUD OPERATIONS ============

  // Create appointment
  openCreateModal(): void {
    this.resetAppointmentForm();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetAppointmentForm();
  }

  createAppointment(): void {
    if (!this.validateAppointmentForm()) {
      return;
    }

    this.isCreating = true;
    this.userAppointmentService.createAppointment(this.appointmentForm).subscribe(
      (response) => {
        if (response.success !== false) {
          this.toastr.success('Appointment created successfully', 'Success');
          this.closeCreateModal();
          this.loadUserAppointments();
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

  // Edit appointment
  openEditModal(appointment: UserAppointment): void {
    this.router.navigate(['/my-appointments/edit', appointment.id]);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentAppointment = null;
    this.editForm = {};
  }

  updateAppointment(): void {
    if (!this.currentAppointment) return;

    this.isUpdating = true;
    this.userAppointmentService.updateAppointment(this.currentAppointment.id, this.editForm).subscribe(
      (response) => {
        if (response.success !== false) {
          this.toastr.success('Appointment updated successfully', 'Success');
          this.closeEditModal();
          this.loadUserAppointments();
        } else {
          this.toastr.error(response.message || 'Failed to update appointment', 'Error');
        }
        this.isUpdating = false;
      },
      (error) => {
        console.error('Error updating appointment:', error);
        this.toastr.error('Failed to update appointment', 'Error');
        this.isUpdating = false;
      }
    );
  }

  // Cancel appointment
  openCancelModal(appointment: UserAppointment): void {
    this.currentAppointment = appointment;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.currentAppointment = null;
  }

  cancelAppointment(): void {
    if (!this.currentAppointment) return;

    this.isCancelling = true;
    this.userAppointmentService.cancelAppointment(this.currentAppointment.id).subscribe(
      (response) => {
        if (response.success !== false) {
          this.toastr.success('Appointment cancelled successfully', 'Success');
          this.closeCancelModal();
          this.loadUserAppointments();
        } else {
          this.toastr.error(response.message || 'Failed to cancel appointment', 'Error');
        }
        this.isCancelling = false;
      },
      (error) => {
        console.error('Error cancelling appointment:', error);
        this.toastr.error('Failed to cancel appointment', 'Error');
        this.isCancelling = false;
      }
    );
  }

  // ============ FORM MANAGEMENT ============

  initializeForm(): void {
    this.appointmentForm = {
      date: '',
      time: '',
      petname: '',
      docname: '',
      name: this.userName,
      email: this.userEmail,
      contactNumber: this.userProfile?.phone || this.userProfile?.contactNumber || '',
      appointmentType: '',
      notes: '',
      petAge: '',
      petBreed: '',
      reasonForVisit: ''
    };
  }

  resetAppointmentForm(): void {
    this.appointmentForm = {
      date: '',
      time: '',
      petname: '',
      docname: '',
      name: this.userName,
      email: this.userEmail,
      contactNumber: this.userProfile?.phone || this.userProfile?.contactNumber || '',
      appointmentType: '',
      notes: '',
      petAge: '',
      petBreed: '',
      reasonForVisit: ''
    };
  }

  validateAppointmentForm(): boolean {
    if (!this.appointmentForm.date || !this.appointmentForm.time) {
      this.toastr.error('Please select date and time', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.petname) {
      this.toastr.error('Please select a pet', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.docname) {
      this.toastr.error('Please select a doctor', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.contactNumber) {
      this.toastr.error('Please enter contact number', 'Validation Error');
      return false;
    }
    return true;
  }

  // ============ UTILITY METHODS ============

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'cancelled':
        return 'badge bg-danger';
      case 'completed':
        return 'badge bg-primary';
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
    return timeString;
  }

  canEditAppointment(appointment: UserAppointment): boolean {
    return appointment.status === 'pending' || appointment.status === 'confirmed';
  }

  canCancelAppointment(appointment: UserAppointment): boolean {
    return appointment.status === 'pending' || appointment.status === 'confirmed';
  }

  refreshAppointments(): void {
    this.loadUserAppointments();
  }
} 