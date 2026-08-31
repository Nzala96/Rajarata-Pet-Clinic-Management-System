import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';

interface Pet {
  id: number;
  name: string;
  owner: string;
  type: string;
  breed: string;
  age: number;
}

@Component({
  selector: 'app-edit-pet',
  templateUrl: './edit-pet.component.html',
  styleUrls: ['./edit-pet.component.scss']
})
export class EditPetComponent implements OnInit {
  userEmail: string | null = null;
  petId: number = 0;
  currentPet: Pet | null = null;
  isUpdating = false;
  isLoading = false;

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
    'Other'
  ];

  breedOptions: { [key: string]: string[] } = {
    'Dog': [
      'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle',
      'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 'Siberian Husky',
      'Boxer', 'Shih Tzu', 'Boston Terrier', 'Pomeranian', 'Australian Shepherd',
      'Mixed Breed', 'Other'
    ],
    'Cat': [
      'Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal',
      'Abyssinian', 'Birman', 'Oriental Shorthair', 'Manx', 'Russian Blue',
      'Siamese', 'American Shorthair', 'Scottish Fold', 'Sphynx', 'Norwegian Forest Cat',
      'Mixed Breed', 'Other'
    ],
    'Bird': [
      'Parakeet', 'Cockatiel', 'Canary', 'Lovebird', 'Conure',
      'Macaw', 'African Grey', 'Cockatoo', 'Finch', 'Other'
    ],
    'Fish': [
      'Goldfish', 'Betta', 'Guppy', 'Angelfish', 'Tetra',
      'Molly', 'Platy', 'Swordtail', 'Barb', 'Other'
    ],
    'Rabbit': [
      'Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'Flemish Giant',
      'English Angora', 'Dutch', 'New Zealand', 'Californian', 'Other'
    ],
    'Hamster': [
      'Syrian', 'Dwarf Campbell Russian', 'Dwarf Winter White Russian', 'Roborovski', 'Chinese', 'Other'
    ],
    'Guinea Pig': [
      'American', 'Abyssinian', 'Peruvian', 'Silkie', 'Texel', 'Skinny Pig', 'Other'
    ],
    'Ferret': [
      'Domestic Ferret', 'Angora Ferret', 'Other'
    ],
    'Reptile': [
      'Bearded Dragon', 'Leopard Gecko', 'Ball Python', 'Corn Snake', 'Iguana',
      'Turtle', 'Tortoise', 'Chameleon', 'Other'
    ],
    'Other': ['Mixed', 'Unknown', 'Other']
  };

  editPet: Pet = {
    id: 0,
    name: '',
    owner: '',
    type: '',
    breed: '',
    age: 0
  };

  constructor(
    private petService: PetService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    
    if (!this.userEmail) {
      this.toastr.error('Please log in to edit pets', 'Authentication Required');
      this.router.navigate(['/login']);
      return;
    }

    // Get pet ID from route
    this.route.params.subscribe(params => {
      this.petId = +params['id'];
      if (this.petId) {
        this.loadPet();
      }
    });
  }

  loadPet(): void {
    this.isLoading = true;
    
    // Get all user pets and find the one we need
    this.petService.getPetsByUserEmail(this.userEmail!).subscribe(
      (pets) => {
        const pet = pets.find(p => p.id === this.petId);
        if (pet) {
          this.currentPet = pet;
          this.editPet = { ...pet }; // Create a copy for editing
          this.isLoading = false;
        } else {
          this.toastr.error('Pet not found or you do not have permission to edit it', 'Error');
          this.router.navigate(['/profile']);
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error loading pet:', error);
        // Fallback to get all pets and filter
        this.petService.getPets().subscribe(
          (allPets) => {
            const pet = allPets.find(p => p.id === this.petId && p.owner === this.userEmail);
            if (pet) {
              this.currentPet = pet;
              this.editPet = { ...pet };
              this.isLoading = false;
            } else {
              this.toastr.error('Pet not found or you do not have permission to edit it', 'Error');
              this.router.navigate(['/profile']);
              this.isLoading = false;
            }
          },
          (fallbackError) => {
            console.error('Error loading pets (fallback):', fallbackError);
            this.toastr.error('Failed to load pet', 'Error');
            this.router.navigate(['/profile']);
            this.isLoading = false;
          }
        );
      }
    );
  }

  // Get available breeds for selected species
  getAvailableBreeds(species: string): string[] {
    return this.breedOptions[species] || [];
  }

  // Reset breed when species changes
  onSpeciesChange(): void {
    this.editPet.breed = '';
  }

  validateForm(): boolean {
    if (!this.editPet.name.trim()) {
      this.toastr.error('Please enter pet name', 'Validation Error');
      return false;
    }
    if (!this.editPet.type) {
      this.toastr.error('Please select pet species', 'Validation Error');
      return false;
    }
    if (!this.editPet.breed) {
      this.toastr.error('Please select pet breed', 'Validation Error');
      return false;
    }
    if (!this.editPet.age || this.editPet.age <= 0) {
      this.toastr.error('Please enter a valid age', 'Validation Error');
      return false;
    }
    return true;
  }

  saveEdit(): void {
    if (!this.validateForm()) {
      return;
    }

    if (!this.currentPet) {
      this.toastr.error('No pet to update', 'Error');
      return;
    }

    this.isUpdating = true;
    
    this.petService.editPet(this.editPet.id, this.editPet).subscribe(
      (res) => {
        console.log('Pet updated:', res);
        this.toastr.success('Pet updated successfully!', 'Success');
        this.router.navigate(['/profile']);
        this.isUpdating = false;
      },
      (err) => {
        console.error('Error updating pet:', err);
        this.toastr.error('Failed to update pet. Please try again.', 'Error');
        this.isUpdating = false;
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
}
