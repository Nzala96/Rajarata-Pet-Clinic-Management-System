import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit {

  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';
  doctors: any[] = [];
  userPets: Pet[] = [];
  services: Service[] = [];
  userProfile: UserProfile | null = null;
  
  // Loading states
  isLoadingPets = false;
  isLoadingServices = false;
  isLoadingProfile = false;

  appointmentData = {
    name: '',
    email: '',
    tp: '',
    date: '',
    petname: '',
    docname: '',
    message: '',
    petAge: '',
    petBreed: '',
    appointmentType: ''
  };

  constructor(
    private authService: AuthService, 
    private http: HttpClient, 
    private router: Router, 
    private toastr: ToastrService,
    private petService: PetService,
    private serviceService: ServiceService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();

    this.appointmentData.name = this.username || '';
    this.appointmentData.email = this.useremail || '';

    this.fetchDoctors();
    this.loadUserPets();
    this.loadServices();
    this.loadUserProfile();
  }

  fetchDoctors(): void {
    this.http.get<any[]>('http://localhost:8000/api/doctors')
      .subscribe(
        (data) => {
          this.doctors = data;
        },
        (error) => {
          console.error('Error fetching doctors:', error);
        }
      );
  }

  loadUserPets(): void {
    if (!this.useremail) return;
    
    this.isLoadingPets = true;
    this.petService.getPetsByUserEmail(this.useremail).subscribe(
      (pets) => {
        this.userPets = pets;
        this.isLoadingPets = false;
        console.log('User pets loaded:', pets.length);
      },
      (error) => {
        console.error('Error loading user pets:', error);
        // Fallback to get all pets and filter
        this.petService.getPets().subscribe((allPets) => {
          this.userPets = allPets.filter(pet => pet.owner === this.useremail);
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
    if (!this.useremail) return;
    
    this.isLoadingProfile = true;
    this.userService.getUserProfile(this.useremail).subscribe(
      (profile) => {
        this.userProfile = profile;
        this.appointmentData.tp = profile.phone || profile.contactNumber || '';
        this.isLoadingProfile = false;
        console.log('User profile loaded:', profile);
      },
      (error) => {
        console.error('Error loading user profile:', error);
        this.isLoadingProfile = false;
      }
    );
  }

  onPetSelected(petName: string | undefined): void {
    if (!petName) return;
    
    const selectedPet = this.userPets.find(pet => pet.name === petName);
    if (selectedPet) {
      // Auto-fill pet details
      this.appointmentData.petAge = selectedPet.age.toString();
      this.appointmentData.petBreed = selectedPet.breed;
      
      // Auto-fill user details if available
      if (this.userProfile) {
        this.appointmentData.tp = this.userProfile.phone || this.userProfile.contactNumber || '';
      }
    }
  }

  onSubmit(): void {
    // Copying appointment data for submission
    const appointment = {
      name: this.appointmentData.name,
      email: this.appointmentData.email,
      tp: this.appointmentData.tp,
      date: this.appointmentData.date,
      petname: this.appointmentData.petname,
      docname: this.appointmentData.docname,
      message: this.appointmentData.message,
      petAge: this.appointmentData.petAge,
      petBreed: this.appointmentData.petBreed,
      appointmentType: this.appointmentData.appointmentType,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Sending appointment data via HTTP POST
    this.http.post('http://localhost:8000/api/addappointment', appointment)
      .subscribe(
        (response) => {
          this.toastr.success('Appointment added successfully!', 'Success');

          this.appointmentData = {
            name: this.username || '',
            email: this.useremail || '',
            tp: this.userProfile?.phone || this.userProfile?.contactNumber || '',
            date: '',
            petname: '',
            docname: '',
            message: '',
            petAge: '',
            petBreed: '',
            appointmentType: ''
          };
        },
        (error) => {
          this.toastr.error('Appointment Creation Error!', 'error');
          console.error('Error creating appointment:', error);
        }
      );
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
