import { Component, OnInit } from '@angular/core';
import { AdminClientService, Client, ClientFilters, UpdateClientRequest, Pet } from '../../services/admin-client.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-clients',
  templateUrl: './admin-clients.component.html',
  styleUrls: ['./admin-clients.component.scss']
})
export class AdminClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  cities: string[] = [];
  states: string[] = [];
  
  // Loading states
  isLoading = false;
  isUpdating = false;
  isExporting = false;
  
  // Filters
  filters: ClientFilters = {};
  contactMethods = ['email', 'phone', 'sms'];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  
  // Modal states
  showEditModal = false;
  showDeleteModal = false;
  showDetailsModal = false;
  
  // Current client for editing/deleting/viewing
  currentClient: Client | null = null;
  
  // Edit form data
  editForm: UpdateClientRequest = {};
  
  // Search and filter form
  searchTerm = '';
  selectedIsAdmin: boolean | null = null;
  registrationDateFrom = '';
  registrationDateTo = '';
  hasPets: boolean | null = null;

  constructor(
    private adminClientService: AdminClientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadCities();
    this.loadStates();
  }

  // ===== DATA LOADING =====

  loadClients(): void {
    this.isLoading = true;
    
    // First get all users
    this.adminClientService.getClients(this.filters, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.clients = response.clients;
          this.totalItems = response.total;
          
          // Now fetch pets for each user
          this.loadPetsForClients();
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          this.toastr.error('Failed to load clients. Please check if the backend server is running.', 'Error');
          this.isLoading = false;
        }
      });
  }

  loadPetsForClients(): void {
    if (this.clients.length === 0) {
      this.filteredClients = [];
      this.isLoading = false;
      return;
    }

    // Create an array of observables to fetch pets for each client
    const petObservables = this.clients.map(client => 
      this.adminClientService.getClientPets(client.email)
    );

    // Use forkJoin to fetch all pets in parallel
    forkJoin(petObservables).subscribe({
      next: (petsArrays) => {
        // Assign pets to each client
        this.clients.forEach((client, index) => {
          client.pets = petsArrays[index];
          client.totalPets = petsArrays[index].length;
        });

        this.filteredClients = [...this.clients];
        this.isLoading = false;
        console.log('Clients and pets loaded successfully:', this.clients);
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.toastr.error('Failed to load pets. Some data may be incomplete.', 'Warning');
        this.filteredClients = [...this.clients];
        this.isLoading = false;
      }
    });
  }

  loadCities(): void {
    this.adminClientService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadStates(): void {
    this.adminClientService.getStates().subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (error) => {
        console.error('Error loading states:', error);
      }
    });
  }

  // ===== FILTERING AND SEARCH =====

  applyFilters(): void {
    this.filters = {
      searchTerm: this.searchTerm || undefined,
      isAdmin: this.selectedIsAdmin !== null ? this.selectedIsAdmin : undefined,
      registrationDateFrom: this.registrationDateFrom || undefined,
      registrationDateTo: this.registrationDateTo || undefined,
      hasPets: this.hasPets !== null ? this.hasPets : undefined,
    };
    
    this.currentPage = 1;
    this.loadClients();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedIsAdmin = null;
    this.registrationDateFrom = '';
    this.registrationDateTo = '';
    this.hasPets = null;
    this.filters = {};
    this.currentPage = 1;
    this.loadClients();
  }

  onSearchChange(): void {
    if (this.searchTerm.length >= 3 || this.searchTerm.length === 0) {
      this.applyFilters();
    }
  }

  // ===== PAGINATION =====

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginationPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfRange);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // ===== CLIENT MANAGEMENT =====

  openEditModal(client: Client): void {
    this.currentClient = client;
    this.editForm = { ...client };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentClient = null;
    this.editForm = {};
  }

  openDeleteModal(client: Client): void {
    this.currentClient = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.currentClient = null;
  }

  openDetailsModal(client: Client): void {
    this.currentClient = client;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.currentClient = null;
  }

  updateClient(): void {
    if (!this.currentClient || !this.isValidEditForm()) {
      return;
    }

    this.isUpdating = true;
    this.adminClientService.updateClient(this.currentClient.id, this.editForm)
      .subscribe({
        next: (updatedClient) => {
          // Update the client in the local array
          const index = this.clients.findIndex(c => c.id === updatedClient.id);
          if (index !== -1) {
            this.clients[index] = { ...this.clients[index], ...updatedClient };
            this.filteredClients = [...this.clients];
          }
          
          this.toastr.success('Client updated successfully!', 'Success');
          this.closeEditModal();
          this.isUpdating = false;
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.toastr.error('Failed to update client. Please try again.', 'Error');
          this.isUpdating = false;
        }
      });
  }

  deleteClient(): void {
    if (!this.currentClient) {
      return;
    }

    this.adminClientService.deleteClient(this.currentClient.id)
      .subscribe({
        next: (response) => {
          // Remove the client from the local array
          this.clients = this.clients.filter(c => c.id !== this.currentClient!.id);
          this.filteredClients = [...this.clients];
          this.totalItems--;
          
          this.toastr.success('Client deleted successfully!', 'Success');
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.toastr.error('Failed to delete client. Please try again.', 'Error');
        }
      });
  }

  isValidEditForm(): boolean {
    return !!(this.editForm.name && this.editForm.email);
  }

  viewClientDetails(client: Client): void {
    this.router.navigate(['/admin/clients', client.id]);
  }

  manageClientPets(client: Client): void {
    this.router.navigate(['/admin/clients', client.id, 'pets']);
  }

  viewClientVisitHistory(client: Client): void {
    this.router.navigate(['/admin/clients', client.id, 'visits']);
  }

  exportClients(): void {
    this.isExporting = true;
    this.adminClientService.exportClientsToCSV(this.filters)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `clients_export_${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
          
          this.toastr.success('Clients exported successfully!', 'Success');
          this.isExporting = false;
        },
        error: (error) => {
          console.error('Error exporting clients:', error);
          this.toastr.error('Failed to export clients. Please try again.', 'Error');
          this.isExporting = false;
        }
      });
  }

  // ===== UTILITY METHODS =====

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  getStatusBadgeClass(isAdmin: boolean | undefined): string {
    if (isAdmin === undefined) return 'badge bg-secondary';
    return isAdmin ? 'badge bg-primary' : 'badge bg-success';
  }

  getStatusText(isAdmin: boolean | undefined): string {
    if (isAdmin === undefined) return 'Unknown';
    return isAdmin ? 'Admin' : 'Client';
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