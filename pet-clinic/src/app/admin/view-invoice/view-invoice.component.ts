import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../services/billing.service';
import { Invoice, PaymentStatus, PaymentMethod } from '../../models/billing.model';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  invoice: Invoice | null = null;
  isLoading = false;
  isGeneratingPDF = false;
  PaymentStatus = PaymentStatus;
  PaymentMethod = PaymentMethod;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadInvoice(parseInt(params['id'], 10));
      }
    });
  }

  loadInvoice(id: number): void {
    this.isLoading = true;
    this.billingService.getInvoiceById(id).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.invoice = null;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/billing']);
  }

  formatDate(dateString: string): string {
    return this.billingService.formatDate(dateString);
  }

  formatCurrency(amount: number): string {
    return this.billingService.formatCurrency(amount);
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

  downloadInvoicePDF(): void {
    if (!this.invoice) return;
    this.isGeneratingPDF = true;
    try {
      this.billingService.generateInvoicePDF(this.invoice);
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  editInvoice(): void {
    if (this.invoice && this.invoice.id) {
      this.router.navigate(['/admin/billing/edit', this.invoice.id]);
    }
  }

  processPayment(): void {
    if (this.invoice && this.invoice.id) {
      this.router.navigate(['/admin/billing/payments', this.invoice.id]);
    }
  }
}