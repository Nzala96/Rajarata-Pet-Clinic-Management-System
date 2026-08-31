import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { AuthService } from '../../auth.service';
import { AppointmentService } from '../../services/appointment.service';
declare var bootstrap: any;

interface Pet {
  id: number;
  name: string;
  owner: string;
  type: string;
  breed: string;
  age: number;
}

interface MedicalRecord {
  id: number;
  date: string;
  time: string;
  petname: string;
  docname: string;
  status: string;
  notes?: string;
  appointmentType?: string;
  reasonForVisit?: string;
  petAge?: string;
  petBreed?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  pets: Pet[] = [];
  selectedPet: Pet | null = null;
  editing = false;
  userEmail: string | null = null;
  medicalHistory: MedicalRecord[] = [];
  isLoadingPets = false;
  isLoadingHistory = false;

  // Species and Breeds options
  speciesOptions = [
    'Dog',
    'Cat', 
    'Bird',
    'Fish',
    'Rabbit',
    'Hamster',
    'Guinea Pig',
    'Ferret',
    'Reptile',
    'Horse',
    'Other'
  ];

  breedOptions: { [key: string]: string[] } = {
    'Dog': [
      'Alaskan Malamute',
      'Australian Shepherd',
      'Beagle',
      'Bernese Mountain Dog',
      'Border Collie',
      'Boxer',
      'Bulldog',
      'Chihuahua',
      'Cocker Spaniel',
      'Dachshund',
      'Dalmatian',
      'Doberman',
      'English Bulldog',
      'French Bulldog',
      'German Shepherd',
      'Golden Retriever',
      'Great Dane',
      'Greyhound',
      'Husky',
      'Labrador Retriever',
      'Maltese',
      'Newfoundland',
      'Pekingese',
      'Pomeranian',
      'Poodle',
      'Pug',
      'Rottweiler',
      'Saint Bernard',
      'Samoyed',
      'Shiba Inu',
      'Siberian Husky',
      'Yorkshire Terrier',
      'Mixed Breed',
      'Other'
    ],
    'Cat': [
      'Abyssinian',
      'American Shorthair',
      'Bengal',
      'Birman',
      'British Shorthair',
      'Burmese',
      'Chartreux',
      'Cornish Rex',
      'Devon Rex',
      'Egyptian Mau',
      'Exotic Shorthair',
      'Himalayan',
      'Maine Coon',
      'Manx',
      'Norwegian Forest Cat',
      'Persian',
      'Ragdoll',
      'Russian Blue',
      'Scottish Fold',
      'Siamese',
      'Sphynx',
      'Tonkinese',
      'Turkish Angora',
      'Turkish Van',
      'Mixed Breed',
      'Other'
    ],
    'Bird': [
      'African Grey Parrot',
      'Amazon Parrot',
      'Budgerigar (Budgie)',
      'Cockatiel',
      'Cockatoo',
      'Conure',
      'Eclectus Parrot',
      'Finch',
      'Lovebird',
      'Macaw',
      'Parakeet',
      'Quaker Parrot',
      'Ringneck Parakeet',
      'Canary',
      'Other'
    ],
    'Fish': [
      'Goldfish',
      'Betta Fish',
      'Guppy',
      'Molly',
      'Platy',
      'Swordtail',
      'Tetra',
      'Angelfish',
      'Discus',
      'Cichlid',
      'Koi',
      'Other'
    ],
    'Rabbit': [
      'American',
      'Angora',
      'Belgian Hare',
      'Chinchilla',
      'Dutch',
      'English Lop',
      'Flemish Giant',
      'Holland Lop',
      'Lionhead',
      'Mini Lop',
      'Netherland Dwarf',
      'Rex',
      'Other'
    ],
    'Hamster': [
      'Syrian Hamster',
      'Dwarf Hamster',
      'Roborovski Hamster',
      'Chinese Hamster',
      'Campbell\'s Hamster',
      'Winter White Hamster',
      'Other'
    ],
    'Guinea Pig': [
      'Abyssinian',
      'American',
      'Coronet',
      'Peruvian',
      'Silkie',
      'Teddy',
      'Texel',
      'Other'
    ],
    'Ferret': [
      'Albino',
      'Sable',
      'Champagne',
      'Chocolate',
      'Cinnamon',
      'Other'
    ],
    'Reptile': [
      'Bearded Dragon',
      'Leopard Gecko',
      'Crested Gecko',
      'Ball Python',
      'Corn Snake',
      'Turtle',
      'Tortoise',
      'Iguana',
      'Chameleon',
      'Other'
    ],
    'Horse': [
      'Arabian',
      'Thoroughbred',
      'Quarter Horse',
      'Appaloosa',
      'Paint Horse',
      'Morgan',
      'Tennessee Walking Horse',
      'Clydesdale',
      'Friesian',
      'Other'
    ],
    'Other': [
      'Other'
    ]
  };

  // New Pet form model
  newPet = {
    name: '',
    owner: '',
    type: '',
    breed: '',
    age: null as number | null
  };

  constructor(
    private petService: PetService,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get the logged-in user's email
    this.userEmail = this.authService.getUserEmail();
    
    if (this.userEmail) {
      this.getUserPets();
      this.loadMedicalHistory();
    } else {
      console.error('User not logged in or email not found');
    }
  }

  // Get available breeds for selected species
  getAvailableBreeds(species: string): string[] {
    return this.breedOptions[species] || [];
  }

  // Reset breed when species changes
  onSpeciesChange() {
    this.newPet.breed = '';
  }

  // Reset breed when species changes in edit mode
  onEditSpeciesChange() {
    if (this.selectedPet) {
      this.selectedPet.breed = '';
    }
  }

  // 📥 Get pets for the logged-in user only
  getUserPets() {
    if (!this.userEmail) return;

    this.isLoadingPets = true;
    // Try to use the specific endpoint for user pets, with fallback to filtering all pets
    this.petService.getPetsByUserEmail(this.userEmail).subscribe(
      (data) => {
        this.pets = data;
        this.isLoadingPets = false;
      },
      (error) => {
        // Fallback: if the backend doesn't support the user-specific endpoint yet,
        // fetch all pets and filter on the frontend
        console.warn('User-specific pet endpoint not available, using fallback method');
        this.petService.getPets().subscribe((data) => {
          this.pets = data.filter(pet => pet.owner === this.userEmail);
          this.isLoadingPets = false;
        });
      }
    );
  }

  // 🏥 Load medical history from completed appointments
  loadMedicalHistory() {
    if (!this.userEmail) {
      console.log('No user email available, skipping medical history load');
      return;
    }

    this.isLoadingHistory = true;
    console.log('Loading medical history for user:', this.userEmail);

    this.appointmentService.getAllAppointments().subscribe(
      (data: any[]) => {
        console.log('All appointments received:', data.length);
        
        // Filter completed appointments for this user
        const userAppointments = data.filter(appt => appt.email === this.userEmail);
        console.log('User appointments found:', userAppointments.length);
        
        const completedAppointments = userAppointments.filter(appt => 
          appt.status === 'completed' || appt.status === 'Completed'
        );
        console.log('Completed appointments found:', completedAppointments.length);

        // Map appointments to medical records
        this.medicalHistory = completedAppointments
          .map(appt => ({
            id: appt.id,
            date: appt.date,
            time: appt.time,
            petname: appt.petname,
            docname: appt.docname,
            status: appt.status,
            notes: appt.notes || appt.message || '',
            appointmentType: appt.appointmentType || 'General Checkup',
            reasonForVisit: appt.reasonForVisit || '',
            petAge: appt.petAge || '',
            petBreed: appt.petBreed || ''
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        console.log('Medical history processed:', this.medicalHistory.length, 'records');
        this.isLoadingHistory = false;
      },
      (error) => {
        console.error('Error loading medical history:', error);
        this.isLoadingHistory = false;
        // Set empty array to avoid undefined errors
        this.medicalHistory = [];
      }
    );
  }

  // Get medical history for a specific pet
  getPetMedicalHistory(petName: string): MedicalRecord[] {
    return this.medicalHistory.filter(record => record.petname === petName);
  }

  // Refresh medical history (can be called manually)
  refreshMedicalHistory() {
    console.log('Refreshing medical history...');
    this.loadMedicalHistory();
  }

  // Get medical history summary for dashboard
  getMedicalHistorySummary() {
    const totalRecords = this.medicalHistory.length;
    const recentRecords = this.medicalHistory.slice(0, 5);
    const petsWithHistory = [...new Set(this.medicalHistory.map(record => record.petname))];
    
    return {
      totalRecords,
      recentRecords,
      petsWithHistory: petsWithHistory.length,
      lastVisit: this.medicalHistory.length > 0 ? this.medicalHistory[0].date : null
    };
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format time for display
  formatTime(timeString: string): string {
    return timeString;
  }

  // ✏️ Start edit mode
  startEdit(pet: Pet): void {
    this.router.navigate(['/pets/edit', pet.id]);
  }

  cancelEdit() {
    this.editing = false;
    this.selectedPet = null;

    // Hide modal manually if needed
    const modalElement = document.getElementById('editPetModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }

  saveEdit() {
    if (!this.selectedPet?.id) return;

    this.petService.editPet(this.selectedPet.id, this.selectedPet).subscribe(
      (res) => {
        console.log('Pet updated:', res);
        this.editing = false;
        this.getUserPets(); // Refresh user's pets
        this.selectedPet = null;

        // Hide modal after saving
        const modalElement = document.getElementById('editPetModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) modal.hide();
        }
      },
      (err) => {
        console.error('Error updating pet:', err);
      }
    );
  }

  // 🧹 Reset form
  clearNewPetForm() {
    this.newPet = {
      name: '',
      owner: this.userEmail || '', // Always pre-fill with user email
      type: '',
      breed: '',
      age: null
    };
  }

  // 🔹 Open Add Pet Modal
  openAddPetModal(): void {
    this.router.navigate(['/pets/add']);
  }

  // 🔹 Close Add Pet Modal
  closeAddPetModal() {
    this.clearNewPetForm();
    
    // Hide modal
    const modalElement = document.getElementById('addPetModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }

  // ➕ Add new pet (updated to close modal)
  addPet() {
    // Ensure the owner is set to the logged-in user's email
    this.newPet.owner = this.userEmail || '';
    
    const { name, owner } = this.newPet;

    this.petService.findByPetnameAndOwner(name, owner).subscribe(
      (existingPet) => {
        alert('This pet already exists!');
      },
      (error) => {
        if (error.status === 404) {
          this.petService.addPet(this.newPet).subscribe(
            (res) => {
              console.log('Pet added:', res);
              this.getUserPets(); // Refresh user's pets
              this.clearNewPetForm();
              this.closeAddPetModal(); // Close modal instead of hiding form
            },
            (err) => {
              console.error('Error adding pet:', err);
              alert('Failed to add pet.');
            }
          );
        } else {
          alert('Something went wrong while checking for duplicates.');
        }
      }
    );
  }
}
