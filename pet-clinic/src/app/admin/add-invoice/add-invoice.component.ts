import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillingService } from '../../services/billing.service';
import { DoctorService } from '../../services/doctor.service';
import { ServiceService } from '../../services/service.service';
import { Doctor } from '../../models/doctor.model';
import { Service } from '../../models/service.model';
import { CreateInvoiceRequest, TAX_RATES } from '../../models/billing.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {
  doctors: Doctor[] = [];
  services: Service[] = [];
  taxRates = TAX_RATES;
  isCreating = false;
  
  // Form data
  createForm: CreateInvoiceRequest = {
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    pet_name: '',
    doctor_name: '',
    service_name: '',
    service_description: '',
    service_price: 0,
    additional_charges: 0,
    discount: 0,
    tax_rate: 10,
    due_date: '',
    notes: ''
  };

  constructor(
    private billingService: BillingService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadServices();
    this.setDefaultDueDate();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Failed to load doctors', 'Error');
      }
    });
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.toastr.error('Failed to load services', 'Error');
      }
    });
  }

  setDefaultDueDate(): void {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now
    this.createForm.due_date = dueDate.toISOString().split('T')[0];
  }

  onDoctorSelected(doctorName: string): void {
    this.createForm.doctor_name = doctorName;
  }

  onServiceSelected(serviceId: number): void {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      this.createForm.service_name = service.name;
      this.createForm.service_price = service.price;
      this.createForm.service_description = service.description || '';
    }
  }

  calculateTotal(): number {
    const subtotal = this.createForm.service_price + (this.createForm.additional_charges || 0);
    const afterDiscount = subtotal - (this.createForm.discount || 0);
    const tax = afterDiscount * (this.createForm.tax_rate / 100);
    return afterDiscount + tax;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  }

  createInvoice(): void {
    if (this.isCreating) return;
    
    // Validate required fields
    if (!this.createForm.patient_name || !this.createForm.doctor_name || !this.createForm.service_name) {
      this.toastr.error('Please select patient, doctor, and service', 'Validation Error');
      return;
    }
    
    this.isCreating = true;
    this.billingService.createInvoice(this.createForm).subscribe({
      next: (response) => {
        this.toastr.success('Invoice created successfully!', 'Success');
        this.router.navigate(['/admin/billing']);
      },
      error: (error) => {
        console.error('Error creating invoice:', error);
        this.toastr.error('Failed to create invoice', 'Error');
        this.isCreating = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/billing']);
  }
}
