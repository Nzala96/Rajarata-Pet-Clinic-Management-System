import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.scss']
})
export class ViewServiceComponent implements OnInit {
  service: Service | null = null;
  isLoading = false;
  serviceId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('ViewServiceComponent initialized');
    this.route.params.subscribe(params => {
      this.serviceId = +params['id'];
      console.log('Service ID from route:', this.serviceId);
      if (this.serviceId) {
        this.loadService();
      }
    });
  }

  loadService(): void {
    this.isLoading = true;
    console.log('Loading service with ID:', this.serviceId);
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (service) => {
        console.log('Service loaded successfully:', service);
        this.service = service;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        this.toastr.error('Failed to load service details');
        this.isLoading = false;
      }
    });
  }

  getStatusBadgeClass(available: boolean | undefined): string {
    return available ? 'badge bg-success' : 'badge bg-danger';
  }

  getStatusText(available: boolean | undefined): string {
    return available ? 'Available' : 'Unavailable';
  }

  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) return 'Rs.0.00';
    return `Rs.${price.toFixed(2)}`;
  }

  editService(): void {
    if (this.service) {
      this.router.navigate(['/admin/services/edit', this.service.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/services']);
  }
} 