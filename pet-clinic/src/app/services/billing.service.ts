import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { 
  Invoice, 
  Payment, 
  CreateInvoiceRequest, 
  UpdateInvoiceRequest, 
  CreatePaymentRequest,
  BillingSearchFilters, 
  BillingStatistics,
  PaymentStatus, 
  PaymentMethod,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS
} from '../models/billing.model';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Invoice Management
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<{ success: boolean; data: Invoice[] }>(`${this.apiUrl}/invoices`).pipe(
      map(response => response.data),  // unwrap data here
      catchError(error => {
        console.error('Error fetching invoices:', error);
        return of([]);
      })
    );
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<{ success: boolean; data: Invoice }>(`${this.apiUrl}/invoices/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching invoice:', error);
        throw error;
      })
    );
  }

  createInvoice(invoiceData: CreateInvoiceRequest): Observable<any> {
    const invoice = this.calculateInvoiceTotals({
      ...invoiceData,
      invoice_number: this.generateInvoiceNumber(),
      issue_date: new Date().toISOString().split('T')[0],
      payment_status: PaymentStatus.UNPAID,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    
    return this.http.post(`${this.apiUrl}/invoices`, invoice).pipe(
      catchError(error => {
        console.error('Error creating invoice:', error);
        throw error;
      })
    );
  }

  updateInvoice(id: number, invoiceData: UpdateInvoiceRequest): Observable<any> {
    const updateData = {
      ...invoiceData,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    return this.http.put(`${this.apiUrl}/invoices/${id}`, updateData).pipe(
      catchError(error => {
        console.error('Error updating invoice:', error);
        throw error;
      })
    );
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/invoices/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting invoice:', error);
        throw error;
      })
    );
  }

  // Payment Management
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`).pipe(
      catchError(error => {
        console.error('Error fetching payments:', error);
        return of([]);
      })
    );
  }

  getPaymentsByInvoice(invoiceId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/invoices/${invoiceId}/payments`).pipe(
      catchError(error => {
        console.error('Error fetching payments:', error);
        return of([]);
      })
    );
  }

  createPayment(paymentData: CreatePaymentRequest): Observable<any> {
    const payment = {
      ...paymentData,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    return this.http.post(`${this.apiUrl}/payments`, payment).pipe(
      catchError(error => {
        console.error('Error creating payment:', error);
        throw error;
      })
    );
  }

  // Search and Filter
  searchInvoices(filters: BillingSearchFilters): Observable<Invoice[]> {
    return this.getInvoices().pipe(
      map(invoices => {
        let filteredInvoices = invoices;

        // Search by patient name, invoice number, or doctor name
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredInvoices = filteredInvoices.filter(invoice =>
            invoice.patient_name.toLowerCase().includes(searchTerm) ||
            invoice.invoice_number.toLowerCase().includes(searchTerm) ||
            invoice.doctor_name.toLowerCase().includes(searchTerm)
          );
        }

        // Filter by payment status
        if (filters.payment_status) {
          filteredInvoices = filteredInvoices.filter(invoice =>
            invoice.payment_status === filters.payment_status
          );
        }

        // Filter by payment method
        if (filters.payment_method) {
          filteredInvoices = filteredInvoices.filter(invoice =>
            invoice.payment_method === filters.payment_method
          );
        }

        // Filter by date range
        if (filters.date_range) {
          filteredInvoices = filteredInvoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issue_date);
            const startDate = new Date(filters.date_range!.start);
            const endDate = new Date(filters.date_range!.end);
            return invoiceDate >= startDate && invoiceDate <= endDate;
          });
        }

        // Filter by amount range
        if (filters.amount_range) {
          filteredInvoices = filteredInvoices.filter(invoice =>
            invoice.total_amount >= filters.amount_range!.min &&
            invoice.total_amount <= filters.amount_range!.max
          );
        }

        return filteredInvoices;
      })
    );
  }

  // Statistics
  getBillingStatistics(): Observable<BillingStatistics> {
    return this.getInvoices().pipe(
      map(invoices => {
        const totalInvoices = invoices.length;
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
        const paidInvoices = invoices.filter(inv => inv.payment_status === PaymentStatus.PAID).length;
        const unpaidInvoices = invoices.filter(inv => inv.payment_status === PaymentStatus.UNPAID).length;
        const overdueInvoices = invoices.filter(inv => inv.payment_status === PaymentStatus.OVERDUE).length;
        const averageInvoiceAmount = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

        // Monthly revenue (current month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.issue_date);
            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
          })
          .reduce((sum, inv) => sum + inv.total_amount, 0);

        // Payment method breakdown
        const paymentMethodBreakdown = Object.values(PaymentMethod).map(method => ({
          method,
          count: invoices.filter(inv => inv.payment_method === method).length,
          total: invoices.filter(inv => inv.payment_method === method).reduce((sum, inv) => sum + inv.total_amount, 0)
        }));

        // Recent invoices (last 10)
        const recentInvoices = invoices
          .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
          .slice(0, 10);

        return {
          totalInvoices,
          totalRevenue,
          paidInvoices,
          unpaidInvoices,
          overdueInvoices,
          averageInvoiceAmount,
          monthlyRevenue,
          paymentMethodBreakdown,
          recentInvoices
        };
      })
    );
  }

  // PDF Generation
  generateInvoicePDF(invoice: Invoice): void {
    const pdf = new jsPDF();
  
    // Safely cast all number-like fields
    const service_price = Number(invoice.service_price || 0);
    const additional_charges = Number(invoice.additional_charges || 0);
    const discount = Number(invoice.discount || 0);
    const subtotal = Number(invoice.subtotal || 0);
    const tax_rate = Number(invoice.tax_rate || 0);
    const tax_amount = Number(invoice.tax_amount || 0);
    const total_amount = Number(invoice.total_amount || 0);
  
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.text('INVOICE', 20, 30);
  
    // Company Info
    pdf.setFontSize(12);
    pdf.setTextColor(100);
    pdf.text('Rajarata Pet Clinic', 20, 45);
    pdf.text('123 Pet Care Street', 20, 55);
    pdf.text('Anuradhapura, Sri Lanka', 20, 65);
    pdf.text('Phone: +94 25 222 3333', 20, 75);
    pdf.text('Email: info@rajaratapetclinic.com', 20, 85);
  
    // Invoice Info
    pdf.setFontSize(12);
    pdf.setTextColor(40);
    pdf.text(`Invoice #: ${invoice.invoice_number}`, 140, 45);
    pdf.text(`Issue Date: ${this.formatDate(invoice.issue_date)}`, 140, 55);
    pdf.text(`Due Date: ${this.formatDate(invoice.due_date)}`, 140, 65);
    pdf.text(`Status: ${PAYMENT_STATUS_LABELS[invoice.payment_status]}`, 140, 75);
  
    // Patient Info
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Bill To:', 20, 110);
    pdf.setFontSize(12);
    pdf.text(invoice.patient_name || '', 20, 125);
    pdf.text(invoice.patient_email || '', 20, 135);
    pdf.text(invoice.patient_phone || '', 20, 145);
  
    // Service Details Table
    const tableData = [
      ['Service', 'Doctor', 'Amount'],
      [
        invoice.service_name + (invoice.service_description ? `\n${invoice.service_description}` : ''),
        invoice.doctor_name,
        `Rs.${service_price.toFixed(2)}`
      ]
    ];
  
    if (additional_charges > 0) {
      tableData.push(['Additional Charges', '', `Rs.${additional_charges.toFixed(2)}`]);
    }
  
    if (discount > 0) {
      tableData.push(['Discount', '', `-Rs.${discount.toFixed(2)}`]);
    }
  
    autoTable(pdf, {
      startY: 160,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [71, 85, 105] }
    });
  
    // Totals (subtotal and tax amount removed, only tax percentage shown)
    const finalY = (pdf as any).lastAutoTable.finalY + 20;
  
    pdf.setFontSize(12);
    pdf.text(`Tax Rate: ${tax_rate}%`, 140, finalY);
  
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total: Rs.${total_amount.toFixed(2)}`, 140, finalY + 15);
  
    // Notes section removed as requested
  
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Thank you for choosing Rajarata Pet Clinic!', 20, 280);
    pdf.text('For any questions regarding this invoice, please contact us.', 20, 290);
  
    // Save PDF
    pdf.save(`invoice-${invoice.invoice_number}.pdf`);
  }
  

  // Utility Methods
  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  }

  calculateInvoiceTotals(invoice: any): any {
    const servicePrice = invoice.service_price || 0;
    const additionalCharges = invoice.additional_charges || 0;
    const discount = invoice.discount || 0;
    const taxRate = invoice.tax_rate || 0;

    const subtotal = servicePrice + additionalCharges - discount;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    return {
      ...invoice,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return PAYMENT_STATUS_LABELS[status];
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return PAYMENT_METHOD_LABELS[method];
  }

  getStatusBadgeClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PAID:
        return 'badge bg-success';
      case PaymentStatus.PARTIALLY_PAID:
        return 'badge bg-warning';
      case PaymentStatus.UNPAID:
        return 'badge bg-secondary';
      case PaymentStatus.OVERDUE:
        return 'badge bg-danger';
      case PaymentStatus.CANCELLED:
        return 'badge bg-dark';
      default:
        return 'badge bg-secondary';
    }
  }

  // Generate bulk invoices from appointments
  generateInvoicesFromAppointments(appointments: any[]): Observable<any> {
    const invoices = appointments.map(appointment => ({
      appointment_id: appointment.id,
      patient_name: appointment.patient_name || 'Unknown Patient',
      patient_email: appointment.patient_email || '',
      patient_phone: appointment.patient_phone || '',
      doctor_name: appointment.doctor_name || 'Unknown Doctor',
      service_name: appointment.service_name || 'General Consultation',
      service_description: appointment.service_description || '',
      service_price: appointment.service_price || 50,
      tax_rate: 10,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      notes: `Invoice for appointment on ${appointment.appointment_date}`
    }));

    return this.http.post(`${this.apiUrl}/invoices/bulk`, { invoices }).pipe(
      catchError(error => {
        console.error('Error creating bulk invoices:', error);
        throw error;
      })
    );
  }
} 