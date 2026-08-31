import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillingService } from '../../services/billing.service';
import { AdminClientService, Client } from '../../services/admin-client.service';
import { DoctorService } from '../../services/doctor.service';
import { ServiceService } from '../../services/service.service';
import { Doctor } from '../../models/doctor.model';
import { Service } from '../../models/service.model';
import { 
  Invoice, 
  Payment, 
  CreatePaymentRequest, 
  BillingSearchFilters, 
  PaymentStatus, 
  PaymentMethod,
  TAX_RATES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS
} from '../../models/billing.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-billing-management',
  templateUrl: './billing-management.component.html',
  styleUrls: ['./billing-management.component.scss']
})
export class BillingManagementComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  payments: Payment[] = [];
  
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
  Object = Object; // Make Object available in template
  
  // Loading states
  isLoading = false;
  isUpdating = false;
  isDeleting = false;
  isProcessingPayment = false;
  isGeneratingPDF = false;
  
  // Search and filter
  searchFilters: BillingSearchFilters = {};
  searchTerm = '';
  selectedPaymentStatus = '';
  selectedPaymentMethod = '';
  dateRange = { start: '', end: '' };
  amountRange = { min: 0, max: 10000 };
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Modal states
  showDeleteModal = false;
  showPaymentModal = false;
  
  // Current invoice for operations
  currentInvoice: Invoice | null = null;
  
  // Form data
  editForm: any = {
    id: 0
  };

  paymentForm: CreatePaymentRequest = {
    invoice_id: 0,
    amount: 0,
    payment_method: PaymentMethod.CASH,
    payment_date: '',
    transaction_id: '',
    reference_number: '',
    notes: ''
  };
  
  // Statistics
  statistics = {
    totalInvoices: 0,
    totalRevenue: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    overdueInvoices: 0,
    averageInvoiceAmount: 0,
    monthlyRevenue: 0
  };
  
  // User info
  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';

  constructor(
    private billingService: BillingService,
    private adminClientService: AdminClientService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();
    
    this.loadInvoices();
    this.loadStatistics();
    this.loadPatients();
    this.loadDoctors();
    this.loadServices();
    this.setDefaultDates();
  }

  setDefaultDates(): void {
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // this.createForm.due_date = thirtyDaysLater.toISOString().split('T')[0]; // Removed as per edit hint
    this.paymentForm.payment_date = today.toISOString().split('T')[0];
  }

  // Load data
  loadInvoices(): void {
    this.isLoading = true;
    console.log('Loading invoices from API...');
  
    this.billingService.getInvoices().subscribe(
      (invoices) => {
        console.log('Invoices loaded successfully:', invoices);
        this.invoices = invoices;
        this.filteredInvoices = invoices;
        this.totalItems = invoices.length;
        this.isLoading = false;
  
        if (invoices.length === 0) {
          this.toastr.info('No invoices found in the database', 'Info');
        } else {
          this.toastr.success(`Loaded ${invoices.length} invoices`, 'Success');
        }
      },
      (error) => {
        console.error('Error loading invoices:', error);
        this.toastr.error('Failed to load invoices. Please check if the backend server is running.', 'Error');
        this.isLoading = false;
      }
    );
  }
  
  

  loadStatistics(): void {
    this.billingService.getBillingStatistics().subscribe(
      (stats) => {
        this.statistics = stats;
      },
      (error) => {
        console.error('Error loading statistics:', error);
      }
    );
  }

  // Load data for dropdowns (keeping for doctor and service dropdowns)
  loadPatients(): void {
    // No longer needed since we're using manual input for patient data
    this.patients = [];
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors) => {
        this.doctors = doctors;
        console.log('Doctors loaded:', this.doctors);
      },
      (error) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Failed to load doctors', 'Error');
      }
    );
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

  applyFilters(): void {
    this.searchFilters = {
      search: this.searchTerm,
      payment_status: this.selectedPaymentStatus as PaymentStatus || undefined,
      payment_method: this.selectedPaymentMethod as PaymentMethod || undefined,
      date_range: this.dateRange.start && this.dateRange.end ? this.dateRange : undefined,
      amount_range: this.amountRange
    };

    this.billingService.searchInvoices(this.searchFilters).subscribe(
      (filteredInvoices) => {
        this.filteredInvoices = filteredInvoices;
        this.totalItems = filteredInvoices.length;
        this.currentPage = 1;
      }
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedPaymentStatus = '';
    this.selectedPaymentMethod = '';
    this.dateRange = { start: '', end: '' };
    this.amountRange = { min: 0, max: 10000 };
    this.searchFilters = {};
    this.filteredInvoices = this.invoices;
    this.totalItems = this.invoices.length;
    this.currentPage = 1;
  }

  // Pagination
  get paginatedInvoices(): Invoice[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredInvoices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Modal management
  openCreateModal(): void {
    this.router.navigate(['/admin/billing/create']);
  }

  openEditModal(invoice: Invoice): void {
    this.router.navigate(['/admin/billing/edit', invoice.id]);
  }

  openViewModal(invoice: Invoice): void {
    console.log('Opening view modal for invoice:', invoice);
    console.log('Invoice ID:', invoice.id);
    this.router.navigate(['/admin/billing/view', invoice.id]);
  }

  openDeleteModal(invoice: Invoice): void {
    this.currentInvoice = invoice;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.currentInvoice = null;
  }

  openPaymentModal(invoice: Invoice): void {
    this.currentInvoice = invoice;
    this.paymentForm = {
      invoice_id: invoice.id || 0,
      amount: invoice.total_amount,
      payment_method: PaymentMethod.CASH,
      payment_date: new Date().toISOString().split('T')[0],
      transaction_id: '',
      reference_number: '',
      notes: ''
    };
    this.showPaymentModal = true;
    setTimeout(() => {
      const modal = new bootstrap.Modal(document.getElementById('paymentModal')!);
      modal.show();
    }, 100);
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.currentInvoice = null;
    this.paymentForm = {
      invoice_id: 0,
      amount: 0,
      payment_method: PaymentMethod.CASH,
      payment_date: '',
      transaction_id: '',
      reference_number: '',
      notes: ''
    };
  }

  // CRUD Operations
  deleteInvoice(): void {
    if (this.isDeleting || !this.currentInvoice?.id) return;
    
    this.isDeleting = true;
    this.billingService.deleteInvoice(this.currentInvoice.id).subscribe(
      (response) => {
        this.toastr.success('Invoice deleted successfully!', 'Success');
        this.closeDeleteModal();
        this.loadInvoices();
        this.loadStatistics();
        this.isDeleting = false;
      },
      (error) => {
        console.error('Error deleting invoice:', error);
        this.toastr.error('Failed to delete invoice', 'Error');
        this.isDeleting = false;
      }
    );
  }

  processPayment(): void {
    if (this.isProcessingPayment) return;
    
    this.isProcessingPayment = true;
    this.billingService.createPayment(this.paymentForm).subscribe(
      (response) => {
        this.toastr.success('Payment processed successfully!', 'Success');
        this.closePaymentModal();
        this.loadInvoices();
        this.loadStatistics();
        this.isProcessingPayment = false;
      },
      (error) => {
        console.error('Error processing payment:', error);
        this.toastr.error('Failed to process payment', 'Error');
        this.isProcessingPayment = false;
      }
    );
  }

  // PDF Generation
  downloadInvoicePDF(invoice: Invoice): void {
    if (this.isGeneratingPDF) return;
    
    this.isGeneratingPDF = true;
    try {
      this.billingService.generateInvoicePDF(invoice);
      this.toastr.success('Invoice PDF downloaded successfully!', 'Success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.toastr.error('Failed to generate PDF', 'Error');
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  // Helper methods
  formatCurrency(amount: number): string {
    return this.billingService.formatCurrency(amount);
  }

  formatDate(dateString: string): string {
    return this.billingService.formatDate(dateString);
  }

  getStatusBadgeClass(status: PaymentStatus): string {
    return this.billingService.getStatusBadgeClass(status);
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return this.billingService.getPaymentStatusLabel(status);
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return this.billingService.getPaymentMethodLabel(method);
  }

  // Export functionality
  exportInvoices(): void {
    const csvData = this.convertToCSV(this.filteredInvoices);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'invoices.csv');
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(invoices: Invoice[]): string {
    const headers = ['Invoice #', 'Patient', 'Doctor', 'Service', 'Amount', 'Status', 'Issue Date', 'Due Date'];
    const rows = invoices.map(invoice => [
      invoice.invoice_number || '',
      invoice.patient_name || '',
      invoice.doctor_name || '',
      invoice.service_name || '',
      invoice.total_amount || '',
      this.getPaymentStatusLabel(invoice.payment_status) || '',
      invoice.issue_date || '',
      invoice.due_date || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Track by function for ngFor performance
  trackByInvoiceId(index: number, invoice: Invoice): any {
    return invoice.id || index;
  }

  // Math object for template access
  Math = Math;
}
