import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { CreateServiceRequest } from '../../models/service.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  isCreating = false;
  
  // Form data
  createForm: CreateServiceRequest = {
    name: '',
    description: '',
    price: 0,
    available: true
  };

  constructor(
    private serviceService: ServiceService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createService(): void {
    if (this.isCreating) return;
    
    this.isCreating = true;
    this.serviceService.createService(this.createForm).subscribe({
      next: (response) => {
        this.toastr.success('Service created successfully!', 'Success');
        this.router.navigate(['/admin/services']);
      },
      error: (error) => {
        console.error('Error creating service:', error);
        this.toastr.error('Failed to create service', 'Error');
        this.isCreating = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/services']);
  }
}
