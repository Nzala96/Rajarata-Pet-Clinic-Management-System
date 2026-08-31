import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service, UpdateServiceRequest, ServiceSearchFilters, SERVICE_CATEGORIES } from '../../models/service.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.scss']
})
export class ServiceManagementComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  // categories = SERVICE_CATEGORIES;
  
  // Loading states
  isLoading = false;
  isUpdating = false;
  isDeleting = false;
  
  // Search and filter
  searchFilters: ServiceSearchFilters = {};
  searchTerm = '';
  // selectedCategory = '';
  availabilityFilter = '';
  priceRange = { min: 0, max: 1000 };
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Modal states
  showDeleteModal = false;
  
  // Current service for editing/viewing/deleting
  currentService: Service | null = null;
  
  // User info
  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';

  constructor(
    private serviceService: ServiceService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServices().subscribe(
      (services: Service[]) => {
        this.services = services;
        this.filteredServices = services;
        this.totalItems = services.length;
        this.isLoading = false;
        if (services.length === 0) {
          this.toastr.info('No services found in the database', 'Info');
        } else {
          this.toastr.success(`Loaded ${services.length} services`, 'Success');
        }
      },
      (error: any) => {
        console.error('Error loading services:', error);
        this.toastr.error('Failed to load services. Please check if the backend server is running.', 'Error');
        this.isLoading = false;
      }
    );
  }

  // Search and filter
  applyFilters(): void {
    this.searchFilters = {
      search: this.searchTerm,
      // category: this.selectedCategory || undefined,
      available: this.availabilityFilter === 'true' ? true : 
                this.availabilityFilter === 'false' ? false : undefined,
      priceRange: this.priceRange
    };

    this.serviceService.searchServices(this.searchFilters).subscribe(
      (filteredServices) => {
        this.filteredServices = filteredServices;
        this.totalItems = filteredServices.length;
        this.currentPage = 1;
      }
    );
  }

  // Clear filters
  clearFilters(): void {
    this.searchTerm = '';
    // this.selectedCategory = '';
    this.availabilityFilter = '';
    this.priceRange = { min: 0, max: 1000 };
    this.searchFilters = {};
    this.filteredServices = this.services;
    this.totalItems = this.services.length;
    this.currentPage = 1;
  }

  // Pagination
  get paginatedServices(): Service[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredServices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Navigation to add service page
  openCreateModal(): void {
    this.router.navigate(['/admin/services/add']);
  }

  openDeleteModal(service: Service): void {
    this.currentService = service;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.currentService = null;
  }

  deleteService(): void {
    if (this.isDeleting || !this.currentService?.id) return;
    
    this.isDeleting = true;
    this.serviceService.deleteService(this.currentService.id).subscribe(
      (response) => {
        this.toastr.success('Service deleted successfully!', 'Success');
        this.closeDeleteModal();
        this.loadServices();
        this.isDeleting = false;
      },
      (error) => {
        console.error('Error deleting service:', error);
        this.toastr.error('Failed to delete service', 'Error');
        this.isDeleting = false;
      }
    );
  }

  getStatusBadgeClass(available: boolean | undefined): string {
    return available ? 'badge bg-success' : 'badge bg-secondary';
  }

  getStatusText(available: boolean | undefined): string {
    return available ? 'Available' : 'Unavailable';
  }

  // getCategoryName(categoryId: string): string {
  //   const category = this.categories.find(c => c.id === categoryId);
  //   return category ? category.name : categoryId;
  // }

  formatPrice(price: number): string {
    return this.serviceService.formatPrice(price);
  }

  // formatDuration(duration: number): string {
  //   return this.serviceService.formatDuration(duration);
  // }

  // Export functionality
  exportServices(): void {
    const csvData = this.convertToCSV(this.filteredServices);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'services.csv');
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(services: Service[]): string {
    const headers = ['ID', 'Name', 'Description', 'Price', 'Available'];
    const rows = services.map(service => [
      service.id || '',
      service.name || '',
      service.description || '',
      // this.getCategoryName(service.category) || '',
      service.price || '',
      // service.duration || '',
      service.available ? 'Yes' : 'No'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Track by function for ngFor performance
  trackByServiceId(index: number, service: Service): any {
    return service.id || index;
  }

  // Math object for template access
  Math = Math;
}
