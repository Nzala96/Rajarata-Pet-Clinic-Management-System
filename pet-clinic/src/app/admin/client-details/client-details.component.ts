import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminClientService, Client, Pet, UpdateClientRequest } from '../../services/admin-client.service';
declare var bootstrap: any;

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  client: Client | null = null;
  clientPets: Pet[] = [];
  
  // Loading states
  isLoading = false;
  isUpdating = false;
  isLoadingPets = false;
  
  // Tab management
  activeTab = 'overview';
  
  // Modal states
  showEditModal = false;
  showDeleteModal = false;
  
  // Form data
  editForm: UpdateClientRequest = {};
  
  // Statistics
  clientStats = {
    totalPets: 0,
    registrationDate: '',
    isAdmin: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminClientService: AdminClientService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const clientId = +params['id'];
      if (clientId) {
        this.loadClientDetails(clientId);
        this.loadClientPets(clientId);
      }
    });
  }

  // ===== DATA LOADING =====

  loadClientDetails(clientId: number): void {
    this.isLoading = true;
    this.adminClientService.getClientById(clientId).subscribe({
      next: (client) => {
        this.client = client;
        this.updateClientStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading client details:', error);
        this.isLoading = false;
      }
    });
  }

  loadClientPets(clientId: number): void {
    this.isLoadingPets = true;
    if (this.client?.email) {
      this.adminClientService.getClientPets(this.client.email).subscribe({
        next: (pets) => {
          this.clientPets = pets;
          this.isLoadingPets = false;
        },
        error: (error) => {
          console.error('Error loading client pets:', error);
          this.isLoadingPets = false;
        }
      });
    } else {
      this.isLoadingPets = false;
    }
  }

  // ===== STATISTICS =====

  updateClientStats(): void {
    if (!this.client) return;
    
    this.clientStats = {
      totalPets: this.client.totalPets || 0,
      registrationDate: this.client.registrationDate || '',
      isAdmin: this.client.isAdmin || false
    };
  }

  // ===== TAB MANAGEMENT =====

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  // ===== CLIENT MANAGEMENT =====

  openEditModal(): void {
    if (!this.client) return;
    this.editForm = { ...this.client };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm = {};
  }

  updateClient(): void {
    if (!this.client || !this.isValidEditForm()) return;

    this.isUpdating = true;
    this.adminClientService.updateClient(this.client.id, this.editForm).subscribe({
      next: (updatedClient) => {
        console.log('Client updated successfully:', updatedClient);
        this.client = updatedClient;
        this.updateClientStats();
        this.closeEditModal();
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating client:', error);
        this.isUpdating = false;
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteClient(): void {
    if (!this.client) return;

    this.adminClientService.deleteClient(this.client.id).subscribe({
      next: (response) => {
        console.log('Client deleted successfully:', response);
        this.router.navigate(['/admin/clients']);
      },
      error: (error) => {
        console.error('Error deleting client:', error);
      }
    });
  }

  // ===== NAVIGATION =====

  goBack(): void {
    this.router.navigate(['/admin/clients']);
  }

  managePets(): void {
    if (this.client) {
      this.router.navigate(['/admin/clients', this.client.id, 'pets']);
    }
  }

  scheduleAppointment(): void {
    if (this.client) {
      this.router.navigate(['/admin/appointments/add'], {
        queryParams: { clientId: this.client.id }
      });
    }
  }

  viewPetDetails(petId: number): void {
    this.router.navigate(['/admin/pets/details', petId]);
  }

  // ===== FORM VALIDATION =====

  isValidEditForm(): boolean {
    return !!(this.editForm.name && this.editForm.email);
  }

  // ===== UTILITY METHODS =====

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  getStatusBadgeClass(isAdmin: boolean | undefined): string {
    if (isAdmin === undefined) return 'badge bg-secondary';
    return isAdmin ? 'badge bg-primary' : 'badge bg-success';
  }

  getStatusText(isAdmin: boolean | undefined): string {
    if (isAdmin === undefined) return 'Unknown';
    return isAdmin ? 'Admin' : 'Client';
  }

  getPetTypeIcon(type: string | undefined): string {
    switch (type?.toLowerCase()) {
      case 'dog': return 'bi-heart-fill text-primary';
      case 'cat': return 'bi-heart-fill text-warning';
      case 'bird': return 'bi-heart-fill text-info';
      case 'fish': return 'bi-heart-fill text-success';
      case 'rabbit': return 'bi-heart-fill text-secondary';
      case 'hamster': return 'bi-heart-fill text-danger';
      default: return 'bi-heart-fill text-muted';
    }
  }

  getTotalPetsText(totalPets: number | undefined): string {
    if (!totalPets || totalPets === 0) return 'No Pets';
    if (totalPets === 1) return 'Pet';
    return 'Pets';
  }

  getTotalVisitsText(totalVisits: number | undefined): string {
    if (!totalVisits || totalVisits === 0) return 'No Visits';
    if (totalVisits === 1) return 'Visit';
    return 'Visits';
  }
} 