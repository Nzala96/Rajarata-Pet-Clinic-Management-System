import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  styleUrls: ['./add-pet.component.scss']
})
export class AddPetComponent implements OnInit {
  userEmail: string | null = null;
  isCreating = false;

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
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    
    if (!this.userEmail) {
      this.toastr.error('Please log in to add a pet', 'Authentication Required');
      this.router.navigate(['/login']);
      return;
    }
    
    this.newPet.owner = this.userEmail;
  }

  // Get available breeds for selected species
  getAvailableBreeds(species: string): string[] {
    return this.breedOptions[species] || [];
  }

  // Reset breed when species changes
  onSpeciesChange(): void {
    this.newPet.breed = '';
  }

  validateForm(): boolean {
    if (!this.newPet.name.trim()) {
      this.toastr.error('Please enter pet name', 'Validation Error');
      return false;
    }
    if (!this.newPet.type) {
      this.toastr.error('Please select pet species', 'Validation Error');
      return false;
    }
    if (!this.newPet.breed) {
      this.toastr.error('Please select pet breed', 'Validation Error');
      return false;
    }
    if (!this.newPet.age || this.newPet.age <= 0) {
      this.toastr.error('Please enter a valid age', 'Validation Error');
      return false;
    }
    return true;
  }

  addPet(): void {
    if (!this.validateForm()) {
      return;
    }

    // Ensure the owner is set to the logged-in user's email
    this.newPet.owner = this.userEmail || '';
    
    const { name, owner } = this.newPet;

    this.isCreating = true;
    
    // Check if pet already exists
    this.petService.findByPetnameAndOwner(name, owner).subscribe(
      (existingPet) => {
        this.toastr.error('This pet already exists!', 'Duplicate Pet');
        this.isCreating = false;
      },
      (error) => {
        if (error.status === 404) {
          // Pet doesn't exist, proceed with creation
          this.petService.addPet(this.newPet).subscribe(
            (res) => {
              console.log('Pet added:', res);
              this.toastr.success('Pet added successfully!', 'Success');
              this.router.navigate(['/profile']);
              this.isCreating = false;
            },
            (err) => {
              console.error('Error adding pet:', err);
              this.toastr.error('Failed to add pet. Please try again.', 'Error');
              this.isCreating = false;
            }
          );
        } else {
          this.toastr.error('Something went wrong while checking for duplicates.', 'Error');
          this.isCreating = false;
        }
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
}
