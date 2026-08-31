import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAppointmentService, CreateUserAppointmentRequest } from '../../services/user-appointment.service';
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
  selector: 'app-add-user-appointment',
  templateUrl: './add-user-appointment.component.html',
  styleUrls: ['./add-user-appointment.component.scss']
})
export class AddUserAppointmentComponent implements OnInit {
  doctors: Doctor[] = [];
  services: Service[] = [];
  userPets: Pet[] = [];
  userProfile: UserProfile | null = null;
  
  // Loading states
  isCreating = false;
  isLoadingPets = false;
  isLoadingServices = false;
  isLoadingProfile = false;
  
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
  
  // User info
  userEmail: string = '';
  userName: string = '';

  constructor(
    private userAppointmentService: UserAppointmentService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private petService: PetService,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadDoctors();
    this.loadServices();
    this.loadUserPets();
    this.loadUserProfile();
    this.initializeForm();
  }

  loadUserInfo(): void {
    this.userEmail = this.authService.getUserEmail() || '';
    this.userName = this.authService.getUsername() || '';
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
        console.log('User pets loaded:', pets.length);
      },
      (error) => {
        console.error('Error loading pets:', error);
        // Fallback to get all pets and filter
        this.petService.getPets().subscribe(
          (allPets) => {
            this.userPets = allPets.filter(pet => pet.owner === this.userEmail);
            this.isLoadingPets = false;
            console.log('User pets loaded (fallback):', this.userPets.length);
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
        this.initializeForm();
      },
      (error) => {
        console.error('Error loading user profile:', error);
        this.isLoadingProfile = false;
      }
    );
  }

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

  onPetSelected(petName: string): void {
    const selectedPet = this.userPets.find(pet => pet.name === petName);
    if (selectedPet) {
      this.appointmentForm.petBreed = selectedPet.breed || '';
      this.appointmentForm.petAge = selectedPet.age ? selectedPet.age.toString() : '';
    }
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
          this.router.navigate(['/my-appointments']);
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

  validateAppointmentForm(): boolean {
    if (!this.appointmentForm.date) {
      this.toastr.error('Please select an appointment date', 'Validation Error');
      return false;
    }
    
    if (!this.appointmentForm.time) {
      this.toastr.error('Please select an appointment time', 'Validation Error');
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
    
    return true;
  }

  onCancel(): void {
    this.router.navigate(['/my-appointments']);
  }
}
