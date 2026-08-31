import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../services/billing.service';
import { AdminClientService } from '../../services/admin-client.service';
import { DoctorService } from '../../services/doctor.service';
import { ServiceService } from '../../services/service.service';
import { ToastrService } from 'ngx-toastr';
import { Invoice, UpdateInvoiceRequest, PaymentStatus, PaymentMethod, PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS, TAX_RATES } from '../../models/billing.model';
import { Client } from '../../services/admin-client.service';
import { Doctor } from '../../models/doctor.model';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss']
})
export class EditInvoiceComponent implements OnInit {
  invoice: Invoice | null = null;
  isLoading = false;
  isUpdating = false;
  
  // Data for dropdowns
  patients: Client[] = [];
  doctors: Doctor[] = [];
  services: Service[] = [];
  
  // Enums for template access
  PaymentStatus = PaymentStatus;
  PaymentMethod = PaymentMethod;
  paymentStatusLabels = PAYMENT_STATUS_LABELS;
  paymentMethodLabels = PAYMENT_METHOD_LABELS;
  taxRates = TAX_RATES;
  Object = Object;
  
  // Form data
  editForm: UpdateInvoiceRequest = {
    id: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private adminClientService: AdminClientService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadInvoice();
    this.loadDropdownData();
  }

  loadInvoice(): void {
    const invoiceId = this.route.snapshot.paramMap.get('id');
    if (!invoiceId) {
      this.toastr.error('Invalid invoice ID');
      this.router.navigate(['/admin/billing']);
      return;
    }

    this.isLoading = true;
    this.billingService.getInvoiceById(parseInt(invoiceId)).subscribe({
      next: (response: any) => {
        // Handle different response formats
        if (response && response.data) {
          this.invoice = response.data;
        } else if (response && response.invoice) {
          this.invoice = response.invoice;
        } else if (response) {
          this.invoice = response;
        }
        
        if (this.invoice) {
          this.populateForm();
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading invoice:', error);
        this.toastr.error('Failed to load invoice details');
        this.isLoading = false;
        this.router.navigate(['/admin/billing']);
      }
    });
  }

  populateForm(): void {
    if (!this.invoice) return;
    
    this.editForm = {
      id: this.invoice.id || 0,
      patient_name: this.invoice.patient_name,
      patient_email: this.invoice.patient_email,
      patient_phone: this.invoice.patient_phone,
      pet_name: this.invoice.pet_name,
      doctor_name: this.invoice.doctor_name,
      service_name: this.invoice.service_name,
      service_description: this.invoice.service_description,
      service_price: this.invoice.service_price,
      additional_charges: this.invoice.additional_charges,
      discount: this.invoice.discount,
      tax_rate: this.invoice.tax_rate,
      payment_status: this.invoice.payment_status,
      payment_method: this.invoice.payment_method,
      due_date: this.invoice.due_date,
      notes: this.invoice.notes
    };
  }

  loadDropdownData(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadServices();
  }

  loadPatients(): void {
    this.adminClientService.getClients().subscribe({
      next: (response: any) => {
        // Handle different response formats
        if (response && response.clients) {
          this.patients = response.clients;
        } else if (response && Array.isArray(response)) {
          this.patients = response;
        } else {
          this.patients = [];
        }
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.patients = [];
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
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
      }
    });
  }

  onDoctorSelected(doctorId: number): void {
    const selectedDoctor = this.doctors.find(d => d.id === doctorId);
    if (selectedDoctor) {
      this.editForm.doctor_name = selectedDoctor.dname;
    }
  }

  onServiceSelected(serviceId: number): void {
    const selectedService = this.services.find(s => s.id === serviceId);
    if (selectedService) {
      this.editForm.service_name = selectedService.name;
      this.editForm.service_description = selectedService.description;
      this.editForm.service_price = selectedService.price;
    }
  }

  updateInvoice(): void {
    if (this.isUpdating || !this.editForm.id) return;
    
    // Validate required fields
    if (!this.editForm.patient_name || !this.editForm.doctor_name || !this.editForm.service_name) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return;
    }
    
    this.isUpdating = true;
    this.billingService.updateInvoice(this.editForm.id, this.editForm).subscribe({
      next: (response) => {
        this.toastr.success('Invoice updated successfully!', 'Success');
        this.isUpdating = false;
        this.router.navigate(['/admin/billing']);
      },
      error: (error) => {
        console.error('Error updating invoice:', error);
        this.toastr.error('Failed to update invoice', 'Error');
        this.isUpdating = false;
      }
    });
  }

  calculateTotal(): number {
    const servicePrice = Number(this.editForm.service_price || 0);
    const additionalCharges = Number(this.editForm.additional_charges || 0);
    const discount = Number(this.editForm.discount || 0);
    const taxRate = Number(this.editForm.tax_rate || 0);
    
    const subtotal = servicePrice + additionalCharges - discount;
    const taxAmount = (subtotal * taxRate) / 100;
    return subtotal + taxAmount;
  }

  goBack(): void {
    this.router.navigate(['/admin/billing']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return this.paymentStatusLabels[status] || 'Unknown';
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return this.paymentMethodLabels[method] || 'Unknown';
  }
}
