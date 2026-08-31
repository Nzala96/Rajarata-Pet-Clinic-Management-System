import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAppointmentService, UserAppointment, UpdateUserAppointmentRequest } from '../../services/user-appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { ServiceService } from '../../services/service.service';
import { PetService } from '../../services/pet.service';
import { UserService, UserProfile } from '../../services/user.service';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Doctor } from '../../models/doctor.model';
import { Service } from '../../models/service.model';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  owner: string;
}

@Component({
  selector: 'app-edit-user-appointment',
  templateUrl: './edit-user-appointment.component.html',
  styleUrl: './edit-user-appointment.component.scss'
})
export class EditUserAppointmentComponent implements OnInit {
  doctors: Doctor[] = [];
  services: Service[] = [];
  userPets: Pet[] = [];
  userProfile: UserProfile | null = null;
  currentAppointment: UserAppointment | null = null;
  
  // Loading states
  isUpdating = false;
  isLoadingPets = false;
  isLoadingServices = false;
  isLoadingProfile = false;
  isLoadingAppointment = false;
  
  // Edit form data
  editForm: UpdateUserAppointmentRequest = {
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
  
  userEmail: string = '';
  userName: string = '';
  appointmentId: number = 0;

  constructor(
    private userAppointmentService: UserAppointmentService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private petService: PetService,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail() || '';
    this.userName = this.authService.getUsername() || '';
    
    // Get appointment ID from route
    this.route.params.subscribe(params => {
      this.appointmentId = +params['id'];
      if (this.appointmentId && this.userEmail) {
        this.loadUserInfo();
        this.loadAppointment();
      }
    });
  }

  loadUserInfo(): void {
    this.loadDoctors();
    this.loadServices();
    this.loadUserPets();
    this.loadUserProfile();
  }

  loadAppointment(): void {
    this.isLoadingAppointment = true;
    
    // First get all user appointments and find the one we need
    this.userAppointmentService.getUserAppointments(this.userEmail).subscribe(
      (appointments) => {
        const appointment = appointments.find(apt => apt.id === this.appointmentId);
        if (appointment) {
          this.currentAppointment = appointment;
          this.populateForm(appointment);
          this.isLoadingAppointment = false;
        } else {
          this.toastr.error('Appointment not found', 'Error');
          this.router.navigate(['/my-appointments']);
          this.isLoadingAppointment = false;
        }
      },
      (error) => {
        console.error('Error loading appointment:', error);
        this.toastr.error('Failed to load appointment', 'Error');
        this.router.navigate(['/my-appointments']);
        this.isLoadingAppointment = false;
      }
    );
  }

  populateForm(appointment: UserAppointment): void {
    this.editForm = {
      date: appointment.date,
      time: appointment.time,
      petname: appointment.petname,
      docname: appointment.docname,
      name: appointment.name,
      email: appointment.email,
      contactNumber: appointment.contactNumber,
      appointmentType: appointment.appointmentType,
      notes: appointment.notes,
      petAge: appointment.petAge,
      petBreed: appointment.petBreed,
      reasonForVisit: appointment.reasonForVisit
    };
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors) => {
        this.doctors = doctors;
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
      },
      (error) => {
        console.error('Error loading services:', error);
        this.toastr.error('Failed to load services', 'Error');
        this.isLoadingServices = false;
      }
    );
  }

  loadUserPets(): void {
    if (!this.userEmail) return;
    
    this.isLoadingPets = true;
    this.petService.getPetsByUserEmail(this.userEmail).subscribe(
      (pets) => {
        this.userPets = pets;
        this.isLoadingPets = false;
      },
      (error) => {
        console.error('Error loading pets:', error);
        // Fallback to get all pets and filter
        this.petService.getPets().subscribe(
          (allPets) => {
            this.userPets = allPets.filter(pet => pet.owner === this.userEmail);
            this.isLoadingPets = false;
          },
          (fallbackError) => {
            console.error('Error loading pets (fallback):', fallbackError);
            this.toastr.error('Failed to load pets', 'Error');
            this.isLoadingPets = false;
          }
        );
      }
    );
  }

  loadUserProfile(): void {
    if (!this.userEmail) return;
    
    this.isLoadingProfile = true;
    this.userService.getUserProfile(this.userEmail).subscribe(
      (profile) => {
        this.userProfile = profile;
        this.isLoadingProfile = false;
      },
      (error) => {
        console.error('Error loading user profile:', error);
        this.isLoadingProfile = false;
      }
    );
  }

  onPetSelected(petName: string): void {
    const selectedPet = this.userPets.find(pet => pet.name === petName);
    if (selectedPet) {
      this.editForm.petBreed = selectedPet.breed || '';
      this.editForm.petAge = selectedPet.age ? selectedPet.age.toString() : '';
      
      // Auto-fill user details if available
      if (this.userProfile) {
        this.editForm.contactNumber = this.userProfile.phone || this.userProfile.contactNumber || '';
      }
    }
  }

  updateAppointment(): void {
    if (!this.validateForm()) {
      return;
    }

    if (!this.currentAppointment) {
      this.toastr.error('No appointment to update', 'Error');
      return;
    }

    this.isUpdating = true;
    this.userAppointmentService.updateAppointment(this.currentAppointment.id, this.editForm).subscribe(
      (response) => {
        if (response.success !== false) {
          this.toastr.success('Appointment updated successfully', 'Success');
          this.router.navigate(['/my-appointments']);
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

  validateForm(): boolean {
    if (!this.editForm.date || !this.editForm.time) {
      this.toastr.error('Please select date and time', 'Validation Error');
      return false;
    }
    if (!this.editForm.petname) {
      this.toastr.error('Please select a pet', 'Validation Error');
      return false;
    }
    if (!this.editForm.docname) {
      this.toastr.error('Please select a doctor', 'Validation Error');
      return false;
    }
    if (!this.editForm.contactNumber) {
      this.toastr.error('Please enter contact number', 'Validation Error');
      return false;
    }
    return true;
  }

  canEditAppointment(): boolean {
    return this.currentAppointment?.status === 'pending' || this.currentAppointment?.status === 'confirmed';
  }

  onCancel(): void {
    this.router.navigate(['/my-appointments']);
  }
}
