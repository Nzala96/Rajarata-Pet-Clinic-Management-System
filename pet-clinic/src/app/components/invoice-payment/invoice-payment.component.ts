import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { BillingService } from '../../services/billing.service';
import { ToastrService } from 'ngx-toastr';
import { Invoice, PaymentStatus, PaymentMethod, PAYMENT_STATUS_LABELS } from '../../models/billing.model';

@Component({
  selector: 'app-invoice-payment',
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  
  // Loading states
  isLoading = false;
  isGeneratingPDF = false;
  
  // Search and filter
  searchTerm = '';
  selectedStatus = '';
  statusOptions = Object.values(PaymentStatus);
  statusLabels = PAYMENT_STATUS_LABELS;
  PaymentStatus = PaymentStatus; // Make available in template
  
  // User info
  userEmail: string = '';
  userName: string = '';
  
  // Statistics
  totalInvoices = 0;
  totalAmount = 0;
  paidInvoices = 0;
  unpaidInvoices = 0;
  
  constructor(
    private authService: AuthService,
    private billingService: BillingService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail() || '';
    this.userName = this.authService.getUsername() || '';
    
    if (this.userEmail) {
      this.loadUserInvoices();
    }
  }

  // ============ DATA LOADING ============

  loadUserInvoices(): void {
    this.isLoading = true;
    
    // Get all invoices and filter by user email
    this.billingService.getInvoices().subscribe(
      (invoices) => {
        // Filter invoices by user email
        this.invoices = invoices.filter(invoice => 
          invoice.patient_email.toLowerCase() === this.userEmail.toLowerCase()
        );
        
        this.applyFilters();
        this.calculateStatistics();
        this.isLoading = false;
        
        console.log('User invoices loaded:', this.invoices.length);
        
        if (this.invoices.length === 0) {
          this.toastr.info('No invoices found for your account', 'Info');
        }
      },
      (error) => {
        console.error('Error loading user invoices:', error);
        this.toastr.error('Failed to load invoices', 'Error');
        this.isLoading = false;
      }
    );
  }

  // ============ FILTERING & SEARCH ============

  applyFilters(): void {
    this.filteredInvoices = this.invoices.filter(invoice => {
      // Status filter
      if (this.selectedStatus && invoice.payment_status !== this.selectedStatus) return false;
      
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return invoice.invoice_number.toLowerCase().includes(searchLower) ||
               invoice.service_name.toLowerCase().includes(searchLower) ||
               invoice.doctor_name.toLowerCase().includes(searchLower) ||
               (invoice.pet_name && invoice.pet_name.toLowerCase().includes(searchLower));
      }
      
      return true;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filteredInvoices = [...this.invoices];
  }

  // ============ STATISTICS ============

  calculateStatistics(): void {
    this.totalInvoices = this.invoices.length;
    this.totalAmount = this.invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    this.paidInvoices = this.invoices.filter(inv => inv.payment_status === PaymentStatus.PAID).length;
    this.unpaidInvoices = this.invoices.filter(inv => 
      inv.payment_status === PaymentStatus.UNPAID || 
      inv.payment_status === PaymentStatus.OVERDUE
    ).length;
  }

  // ============ PDF DOWNLOAD ============

  downloadInvoicePDF(invoice: Invoice | null): void {
    if (this.isGeneratingPDF || !invoice) return;
    
    this.isGeneratingPDF = true;
    
    try {
      this.billingService.generateInvoicePDF(invoice);
      this.toastr.success('Invoice PDF generated successfully!', 'Success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.toastr.error('Failed to generate PDF', 'Error');
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  // ============ UTILITY METHODS ============

  getStatusBadgeClass(status: PaymentStatus | string): string {
    switch (status) {
      case PaymentStatus.PAID:
        return 'badge bg-success';
      case PaymentStatus.UNPAID:
        return 'badge bg-warning text-dark';
      case PaymentStatus.OVERDUE:
        return 'badge bg-danger';
      case PaymentStatus.PARTIALLY_PAID:
        return 'badge bg-info';
      case PaymentStatus.CANCELLED:
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusLabel(status: PaymentStatus | string): string {
    return this.statusLabels[status as PaymentStatus] || status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isOverdue(invoice: Invoice): boolean {
    if (invoice.payment_status === PaymentStatus.PAID) return false;
    
    const dueDate = new Date(invoice.due_date);
    const today = new Date();
    return dueDate < today;
  }

  getDaysOverdue(invoice: Invoice): number {
    if (invoice.payment_status === PaymentStatus.PAID) return 0;
    
    const dueDate = new Date(invoice.due_date);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  refreshInvoices(): void {
    this.loadUserInvoices();
  }

  viewInvoiceDetails(invoice: Invoice): void {
    this.router.navigate(['/admin/billing/view', invoice.id]);
  }
}
