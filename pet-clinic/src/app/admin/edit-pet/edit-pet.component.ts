import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPetService, Pet, UpdatePetRequest } from '../../services/admin-pet.service';

@Component({
  selector: 'app-edit-pet',
  templateUrl: './edit-pet.component.html',
  styleUrls: ['./edit-pet.component.scss']
})
export class EditPetComponent implements OnInit {
  pet: Pet | null = null;
  editForm: UpdatePetRequest = {};
  
  // Loading states
  isLoading = false;
  isUpdating = false;
  
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminPetService: AdminPetService
  ) {}

  ngOnInit() {
    this.loadPet();
  }

  loadPet() {
    const petId = this.route.snapshot.paramMap.get('id');
    if (!petId) {
      this.router.navigate(['/admin/pets']);
      return;
    }

    this.isLoading = true;
    this.adminPetService.getPetById(+petId).subscribe(
      (pet) => {
        this.pet = pet;
        this.editForm = { 
          name: pet.name,
          type: pet.type,
          breed: pet.breed,
          age: pet.age,
          owner: pet.owner
        };
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading pet:', error);
        this.isLoading = false;
        this.router.navigate(['/admin/pets']);
      }
    );
  }

  // Get available breeds for selected species
  getAvailableBreeds(species: string | undefined): string[] {
    if (!species) return [];
    return this.breedOptions[species] || [];
  }

  // Reset breed when species changes
  onSpeciesChange(): void {
    this.editForm.breed = '';
  }

  updatePet() {
    if (!this.pet || !this.isValidEditForm()) return;
    
    this.isUpdating = true;
    this.adminPetService.updatePet(this.pet.id, this.editForm).subscribe(
      (pet) => {
        console.log('Pet updated successfully:', pet);
        this.isUpdating = false;
        this.router.navigate(['/admin/pets']);
      },
      (error) => {
        console.error('Error updating pet:', error);
        this.isUpdating = false;
      }
    );
  }

  cancel() {
    this.router.navigate(['/admin/pets']);
  }

  // Form Validation Methods
  isValidEditForm(): boolean {
    return !!(this.editForm.name && this.editForm.type && this.editForm.breed && 
              this.editForm.age && this.editForm.age > 0 && this.editForm.owner);
  }

  // Utility Methods
  getAgeText(age: number): string {
    if (age === 1) return '1 year';
    if (age < 1) return `${Math.round(age * 12)} months`;
    return `${age} years`;
  }
} 