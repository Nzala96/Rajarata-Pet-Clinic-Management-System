import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service, UpdateServiceRequest } from '../../models/service.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent implements OnInit {
  service: Service | null = null;
  isLoading = false;
  isUpdating = false;
  serviceId: number = 0;

  editForm: UpdateServiceRequest = {
    id: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('EditServiceComponent initialized');
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
        this.editForm = {
          id: service.id || 0,
          name: service.name,
          description: service.description,
          price: service.price,
          available: service.available
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        this.toastr.error('Failed to load service details');
        this.isLoading = false;
      }
    });
  }

  updateService(): void {
    if (!this.editForm.name || !this.editForm.price) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    this.isUpdating = true;
    console.log('Updating service:', this.editForm);

    this.serviceService.updateService(this.serviceId, this.editForm).subscribe({
      next: (response) => {
        console.log('Service updated successfully:', response);
        this.toastr.success('Service updated successfully');
        this.isUpdating = false;
        this.router.navigate(['/admin/services']);
      },
      error: (error) => {
        console.error('Error updating service:', error);
        this.toastr.error('Failed to update service');
        this.isUpdating = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/services']);
  }

  cancel(): void {
    this.router.navigate(['/admin/services']);
  }
} 