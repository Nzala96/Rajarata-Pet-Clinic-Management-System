import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { 
  AppointmentStatistics, 
  ClientVisitFrequency, 
  EarningsReport, 
  ReportFilters,
  AppointmentTrend,
  ClientVisitStat,
  TopVisitingClient,
  MonthlyRevenue,
  RevenueByService,
  RevenueByDoctor,
  PaymentMethodBreakdown,
  OutstandingInvoice,
  RevenueTrend
} from '../models/reports.model';
import { AdminDashboardService, AdminAppointment } from './admin-dashboard.service';
import { BillingService } from './billing.service';
import { Invoice, Payment, PaymentStatus } from '../models/billing.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private adminDashboardService: AdminDashboardService,
    private billingService: BillingService
  ) {}



  getAppointmentStatistics(filters?: ReportFilters): Observable<AppointmentStatistics> {
    return this.adminDashboardService.getAllAppointments().pipe(
      map(appointments => this.calculateAppointmentStatistics(appointments, filters))
    );
  }

  
  getAllAppointmentsForReport(filters?: ReportFilters): Observable<AdminAppointment[]> {
    return this.adminDashboardService.getAllAppointments().pipe(
      map(appointments => this.applyAppointmentFilters(appointments, filters))
    );
  }

  private calculateAppointmentStatistics(appointments: AdminAppointment[], filters?: ReportFilters): AppointmentStatistics {
    
    let filteredAppointments = this.applyAppointmentFilters(appointments, filters);
    
    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = filteredAppointments.filter(a => a.status === 'pending').length;
    const cancelledAppointments = filteredAppointments.filter(a => a.status === 'cancelled').length;
    const confirmedAppointments = filteredAppointments.filter(a => a.status === 'confirmed').length;

    
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = filteredAppointments.filter(a => a.date === today).length;

    
    const thisWeekAppointments = this.getAppointmentsInDateRange(filteredAppointments, this.getWeekStart(), this.getWeekEnd());

    
    const thisMonthAppointments = this.getAppointmentsInDateRange(filteredAppointments, this.getMonthStart(), this.getMonthEnd());

    
    const appointmentsByStatus = this.groupBy(filteredAppointments, 'status');

    
    const appointmentsByDoctor = this.groupBy(filteredAppointments, 'docname');

    
    const appointmentsByMonth = this.groupAppointmentsByMonth(filteredAppointments);

    
    const averageAppointmentsPerDay = this.calculateAverageAppointmentsPerDay(filteredAppointments);

    
    const appointmentTrends = this.generateAppointmentTrends(filteredAppointments);

    return {
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      cancelledAppointments,
      todayAppointments,
      thisWeekAppointments,
      thisMonthAppointments,
      appointmentsByStatus,
      appointmentsByDoctor,
      appointmentsByMonth,
      averageAppointmentsPerDay,
      appointmentTrends
    };
  }



  getClientVisitFrequency(filters?: ReportFilters): Observable<ClientVisitFrequency> {
    return this.adminDashboardService.getAllAppointments().pipe(
      map(appointments => this.calculateClientVisitFrequency(appointments, filters))
    );
  }

  private calculateClientVisitFrequency(appointments: AdminAppointment[], filters?: ReportFilters): ClientVisitFrequency {
    let filteredAppointments = this.applyAppointmentFilters(appointments, filters);
    

    const clientGroups = this.groupByClient(filteredAppointments);
    
    const totalClients = Object.keys(clientGroups).length;
    const activeClients = this.getActiveClientsCount(clientGroups);
    const newClientsThisMonth = this.getNewClientsThisMonth(clientGroups);
    const returningClients = this.getReturningClientsCount(clientGroups);

    
    const clientVisitStats = this.generateClientVisitStats(clientGroups);

    
    const topVisitingClients = this.getTopVisitingClients(clientGroups);

    
    const clientRetentionRate = this.calculateClientRetentionRate(clientGroups);

    
    const averageVisitsPerClient = this.calculateAverageVisitsPerClient(clientGroups);

    return {
      totalClients,
      activeClients,
      newClientsThisMonth,
      returningClients,
      clientVisitStats,
      topVisitingClients,
      clientRetentionRate,
      averageVisitsPerClient
    };
  }



  getEarningsReport(filters?: ReportFilters): Observable<EarningsReport> {
    return this.billingService.getInvoices().pipe(
      map(invoices => this.calculateEarningsReport(invoices, filters))
    );
  }

  private calculateEarningsReport(invoices: Invoice[], filters?: ReportFilters): EarningsReport {
    let filteredInvoices = this.applyInvoiceFilters(invoices, filters);

    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    

    const totalPaidAmount = filteredInvoices
      .filter(inv => inv.payment_status === 'paid' || inv.payment_status === 'partially_paid')
      .reduce((sum, inv) => sum + inv.total_amount, 0);
    
    const totalOutstandingAmount = totalRevenue - totalPaidAmount;

    
    const monthlyRevenue = this.generateMonthlyRevenue(filteredInvoices);

    
    const revenueByService = this.calculateRevenueByService(filteredInvoices);

    
    const revenueByDoctor = this.calculateRevenueByDoctor(filteredInvoices);

    // Payment method breakdown (empty since we don't have payments data)
    const paymentMethodBreakdown: PaymentMethodBreakdown[] = [];

    // Outstanding invoices
    const outstandingInvoices = this.getOutstandingInvoices(filteredInvoices);

    // Revenue trends
    const revenueTrends = this.generateRevenueTrends(filteredInvoices);

    // Average invoice amount
    const averageInvoiceAmount = filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0;

    // Profit margin (assuming 70% profit margin for demo)
    const profitMargin = 70;

    return {
      totalRevenue,
      totalPaidAmount,
      totalOutstandingAmount,
      monthlyRevenue,
      revenueByService,
      revenueByDoctor,
      paymentMethodBreakdown,
      outstandingInvoices,
      revenueTrends,
      averageInvoiceAmount,
      profitMargin
    };
  }

  // ============ HELPER METHODS ============

  private applyAppointmentFilters(appointments: AdminAppointment[], filters?: ReportFilters): AdminAppointment[] {
    if (!filters) return appointments;

    return appointments.filter(appointment => {
      if (filters.dateFrom && appointment.date < filters.dateFrom) return false;
      if (filters.dateTo && appointment.date > filters.dateTo) return false;
      if (filters.status && appointment.status !== filters.status) return false;
      if (filters.doctorId && appointment.docname !== filters.doctorId.toString()) return false;
      return true;
    });
  }

  private applyInvoiceFilters(invoices: Invoice[], filters?: ReportFilters): Invoice[] {
    if (!filters) return invoices;

    return invoices.filter(invoice => {
      if (filters.dateFrom && invoice.issue_date < filters.dateFrom) return false;
      if (filters.dateTo && invoice.issue_date > filters.dateTo) return false;
      if (filters.paymentStatus && invoice.payment_status !== filters.paymentStatus) return false;
      return true;
    });
  }

  // Payment filters removed since payments API is not available

  private groupBy<T>(array: T[], key: keyof T): { [key: string]: number } {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      groups[groupKey] = (groups[groupKey] || 0) + 1;
      return groups;
    }, {} as { [key: string]: number });
  }

  private groupByClient(appointments: AdminAppointment[]): { [key: string]: AdminAppointment[] } {
    return appointments.reduce((groups, appointment) => {
      const clientKey = appointment.email;
      if (!groups[clientKey]) {
        groups[clientKey] = [];
      }
      groups[clientKey].push(appointment);
      return groups;
    }, {} as { [key: string]: AdminAppointment[] });
  }

  private getAppointmentsInDateRange(appointments: AdminAppointment[], startDate: string, endDate: string): number {
    return appointments.filter(a => a.date >= startDate && a.date <= endDate).length;
  }

  private getWeekStart(): string {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return startOfWeek.toISOString().split('T')[0];
  }

  private getWeekEnd(): string {
    const now = new Date();
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return endOfWeek.toISOString().split('T')[0];
  }

  private getMonthStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  }

  private getMonthEnd(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  }

  private groupAppointmentsByMonth(appointments: AdminAppointment[]): { [key: string]: number } {
    return appointments.reduce((groups, appointment) => {
      const monthKey = appointment.date.substring(0, 7); // YYYY-MM
      groups[monthKey] = (groups[monthKey] || 0) + 1;
      return groups;
    }, {} as { [key: string]: number });
  }

  private calculateAverageAppointmentsPerDay(appointments: AdminAppointment[]): number {
    if (appointments.length === 0) return 0;
    
    const dates = [...new Set(appointments.map(a => a.date))];
    return appointments.length / dates.length;
  }

  private generateAppointmentTrends(appointments: AdminAppointment[]): AppointmentTrend[] {
    const trends: AppointmentTrend[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAppointments = appointments.filter(a => a.date === dateStr);
      const completed = dayAppointments.filter(a => a.status === 'completed').length;
      const pending = dayAppointments.filter(a => a.status === 'pending').length;
      const cancelled = dayAppointments.filter(a => a.status === 'cancelled').length;
      
      trends.push({
        date: dateStr,
        count: dayAppointments.length,
        status: 'total'
      });
    }
    
    return trends;
  }

  private getActiveClientsCount(clientGroups: { [key: string]: AdminAppointment[] }): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    return Object.values(clientGroups).filter(appointments => 
      appointments.some(a => a.date >= thirtyDaysAgoStr)
    ).length;
  }

  private getNewClientsThisMonth(clientGroups: { [key: string]: AdminAppointment[] }): number {
    const monthStart = this.getMonthStart();
    
    return Object.values(clientGroups).filter(appointments => {
      const firstAppointment = appointments.sort((a, b) => a.date.localeCompare(b.date))[0];
      return firstAppointment && firstAppointment.date >= monthStart;
    }).length;
  }

  private getReturningClientsCount(clientGroups: { [key: string]: AdminAppointment[] }): number {
    return Object.values(clientGroups).filter(appointments => appointments.length > 1).length;
  }

  private generateClientVisitStats(clientGroups: { [key: string]: AdminAppointment[] }): ClientVisitStat[] {
    return Object.entries(clientGroups).map(([email, appointments]) => {
      const sortedAppointments = appointments.sort((a, b) => a.date.localeCompare(b.date));
      const firstVisit = sortedAppointments[0].date;
      const lastVisit = sortedAppointments[sortedAppointments.length - 1].date;
      
      // Calculate average visits per month
      const firstDate = new Date(firstVisit);
      const lastDate = new Date(lastVisit);
      const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                        (lastDate.getMonth() - firstDate.getMonth()) + 1;
      const averageVisitsPerMonth = appointments.length / Math.max(monthsDiff, 1);
      
      // Group by pets
      const petGroups = this.groupBy(appointments, 'petname');
      const pets: any[] = Object.entries(petGroups).map(([petName, count]) => ({
        petId: 1, // Mock ID
        petName,
        petType: 'Unknown',
        totalVisits: count,
        lastVisit: sortedAppointments[sortedAppointments.length - 1].date,
        commonServices: ['General Checkup'] // Mock data
      }));

      return {
        clientId: 1, // Mock ID
        clientName: appointments[0].name,
        email,
        totalVisits: appointments.length,
        lastVisit,
        firstVisit,
        averageVisitsPerMonth,
        pets
      };
    });
  }

  private getTopVisitingClients(clientGroups: { [key: string]: AdminAppointment[] }): TopVisitingClient[] {
    return Object.entries(clientGroups)
      .map(([email, appointments]) => ({
        clientId: 1, // Mock ID
        clientName: appointments[0].name,
        totalVisits: appointments.length,
        lastVisit: appointments.sort((a, b) => b.date.localeCompare(a.date))[0].date,
        totalSpent: appointments.length * 100, // Mock amount
        pets: [...new Set(appointments.map(a => a.petname))]
      }))
      .sort((a, b) => b.totalVisits - a.totalVisits)
      .slice(0, 10);
  }

  private calculateClientRetentionRate(clientGroups: { [key: string]: AdminAppointment[] }): number {
    const totalClients = Object.keys(clientGroups).length;
    const returningClients = this.getReturningClientsCount(clientGroups);
    return totalClients > 0 ? (returningClients / totalClients) * 100 : 0;
  }

  private calculateAverageVisitsPerClient(clientGroups: { [key: string]: AdminAppointment[] }): number {
    const totalVisits = Object.values(clientGroups).reduce((sum, appointments) => sum + appointments.length, 0);
    const totalClients = Object.keys(clientGroups).length;
    return totalClients > 0 ? totalVisits / totalClients : 0;
  }

  private generateMonthlyRevenue(invoices: Invoice[]): MonthlyRevenue[] {
    const monthlyGroups = this.groupBy(invoices, 'issue_date');
    const months = Object.keys(monthlyGroups).map(date => date.substring(0, 7)).filter((value, index, self) => self.indexOf(value) === index);
    
    return months.map(month => {
      const monthInvoices = invoices.filter(inv => inv.issue_date.startsWith(month));
      const revenue = monthInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      const appointments = monthInvoices.length; // Mock relationship
      
      return {
        month,
        year: parseInt(month.split('-')[0]),
        revenue,
        appointments,
        invoices: monthInvoices.length,
        growth: 0 // Mock growth calculation
      };
    }).sort((a, b) => `${a.year}-${a.month}`.localeCompare(`${b.year}-${b.month}`));
  }

  private calculateRevenueByService(invoices: Invoice[]): RevenueByService[] {
    // Mock service breakdown - in real app, this would come from invoice line items
    const services = [
      { name: 'General Checkup', revenue: 0, appointments: 0 },
      { name: 'Vaccination', revenue: 0, appointments: 0 },
      { name: 'Surgery', revenue: 0, appointments: 0 },
      { name: 'Grooming', revenue: 0, appointments: 0 }
    ];
    
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    
    return services.map(service => ({
      serviceName: service.name,
      revenue: service.revenue,
      appointments: service.appointments,
      averagePrice: service.appointments > 0 ? service.revenue / service.appointments : 0,
      percentageOfTotal: totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0
    }));
  }

  private calculateRevenueByDoctor(invoices: Invoice[]): RevenueByDoctor[] {
    const doctorGroups = this.groupBy(invoices, 'doctor_name');
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    
    return Object.entries(doctorGroups).map(([doctorName, count]) => {
      const doctorInvoices = invoices.filter(inv => inv.doctor_name === doctorName);
      const revenue = doctorInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      
      return {
        doctorName,
        revenue,
        appointments: count,
        averageRevenuePerAppointment: count > 0 ? revenue / count : 0,
        percentageOfTotal: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
      };
    });
  }

  private calculatePaymentMethodBreakdown(payments: Payment[]): PaymentMethodBreakdown[] {
    const methodGroups = this.groupBy(payments, 'payment_method');
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return Object.entries(methodGroups).map(([method, count]) => {
      const methodPayments = payments.filter(p => p.payment_method === method);
      const amount = methodPayments.reduce((sum, p) => sum + p.amount, 0);
      
      return {
        method,
        amount,
        count,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      };
    });
  }

  private getOutstandingInvoices(invoices: Invoice[]): OutstandingInvoice[] {
    const today = new Date();
    
    return invoices
      .filter(inv => inv.payment_status === PaymentStatus.UNPAID || inv.payment_status === PaymentStatus.OVERDUE)
      .map(invoice => {
        const dueDate = new Date(invoice.issue_date);
        dueDate.setDate(dueDate.getDate() + 30); // Assume 30 days payment terms
        const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        return {
          invoiceId: invoice.id || 0,
          invoiceNumber: invoice.invoice_number,
          patientName: invoice.patient_name,
          amount: invoice.total_amount,
          daysOverdue,
          dueDate: dueDate.toISOString().split('T')[0]
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  private generateRevenueTrends(invoices: Invoice[]): RevenueTrend[] {
    const trends: RevenueTrend[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayInvoices = invoices.filter(inv => inv.issue_date === dateStr);
      const revenue = dayInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
      
      trends.push({
        date: dateStr,
        revenue,
        appointments: dayInvoices.length
      });
    }
    
    return trends;
  }

  // ============ EXPORT METHODS ============

  exportReport(reportType: 'appointments' | 'clients' | 'earnings', filters?: ReportFilters): Observable<any> {
    switch (reportType) {
      case 'appointments':
        return this.exportAppointmentReport(filters);
      case 'clients':
        return this.exportClientReport(filters);
      case 'earnings':
        return this.exportEarningsReport(filters);
      default:
        return of(null);
    }
  }

  private exportAppointmentReport(filters?: ReportFilters): Observable<any> {
    return combineLatest([
      this.getAllAppointmentsForReport(filters),
      this.getAppointmentStatistics(filters)
    ]).pipe(
      map(([appointments, stats]) => {
        this.generateAppointmentPDFReport(appointments, stats, filters);
        return { success: true };
      })
    );
  }

  private exportClientReport(filters?: ReportFilters): Observable<any> {
    return this.getClientVisitFrequency(filters).pipe(
      map(data => {
        this.generateClientPDFReport(data, filters);
        return { success: true };
      })
    );
  }

  private exportEarningsReport(filters?: ReportFilters): Observable<any> {
    return this.getEarningsReport(filters).pipe(
      map(data => {
        this.generateEarningsPDFReport(data, filters);
        return { success: true };
      })
    );
  }

  // ============ PDF GENERATION METHODS ============

  private generateAppointmentPDFReport(appointments: AdminAppointment[], stats: AppointmentStatistics, filters?: ReportFilters): void {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.text('APPOINTMENT STATISTICS REPORT', 20, 30);

    // Report Info
    pdf.setFontSize(12);
    pdf.setTextColor(100);
    const timestamp = new Date().toLocaleString();
    pdf.text(`Generated on: ${timestamp}`, 20, 45);
    
    if (filters?.dateFrom && filters?.dateTo) {
      pdf.text(`Date Range: ${filters.dateFrom} to ${filters.dateTo}`, 20, 55);
    }

    // Summary Statistics
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Summary Statistics', 20, 75);
    
    pdf.setFontSize(10);
    pdf.text(`Total Appointments: ${stats.totalAppointments}`, 20, 90);
    pdf.text(`Completed: ${stats.completedAppointments}`, 20, 100);
    pdf.text(`Pending: ${stats.pendingAppointments}`, 20, 110);
    pdf.text(`Cancelled: ${stats.cancelledAppointments}`, 20, 120);
    pdf.text(`Today's Appointments: ${stats.todayAppointments}`, 20, 130);
    pdf.text(`This Week: ${stats.thisWeekAppointments}`, 20, 140);
    pdf.text(`This Month: ${stats.thisMonthAppointments}`, 20, 150);

    // Status Breakdown
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Appointments by Status', 20, 170);
    
    const statusData = Object.entries(stats.appointmentsByStatus).map(([status, count]) => [
      this.capitalizeFirst(status),
      count.toString(),
      `${((count / stats.totalAppointments) * 100).toFixed(1)}%`
    ]);

    autoTable(pdf, {
      startY: 180,
      head: [['Status', 'Count', 'Percentage']],
      body: statusData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [71, 85, 105] }
    });

    // Doctor Breakdown
    const doctorY = (pdf as any).lastAutoTable.finalY + 20;
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Appointments by Doctor', 20, doctorY);
    
    const doctorData = Object.entries(stats.appointmentsByDoctor).map(([doctor, count]) => [
      doctor,
      count.toString(),
      `${((count / stats.totalAppointments) * 100).toFixed(1)}%`
    ]);

    autoTable(pdf, {
      startY: doctorY + 10,
      head: [['Doctor', 'Count', 'Percentage']],
      body: doctorData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [71, 85, 105] }
    });

    // Detailed Appointments Table
    const detailedY = (pdf as any).lastAutoTable.finalY + 20;
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Detailed Appointments List', 20, detailedY);

    // Prepare appointment data for table (notes column removed)
    const appointmentData = appointments.map(appt => [
      appt.id?.toString() || '',
      appt.date,
      appt.time,
      appt.petname || '',
      appt.name || '',
      appt.docname || '',
      this.capitalizeFirst(appt.status),
      appt.appointmentType || ''
    ]);

    autoTable(pdf, {
      startY: detailedY + 10,
      head: [['ID', 'Date', 'Time', 'Pet', 'Owner', 'Doctor', 'Status', 'Type']],
      body: appointmentData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 }
      }
    });

    // Footer
    const finalY = (pdf as any).lastAutoTable.finalY + 20;
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Rajarata Pet Clinic - Appointment Statistics Report', 20, finalY);
    pdf.text(`Total records: ${appointments.length}`, 20, finalY + 10);

    // Save PDF
    const filename = `appointment_report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  }

  private generateClientPDFReport(data: ClientVisitFrequency, filters?: ReportFilters): void {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.text('CLIENT VISIT FREQUENCY REPORT', 20, 30);

    // Summary
    pdf.setFontSize(12);
    pdf.text(`Total Clients: ${data.totalClients}`, 20, 50);
    pdf.text(`Active Clients: ${data.activeClients}`, 20, 60);
    pdf.text(`New This Month: ${data.newClientsThisMonth}`, 20, 70);
    pdf.text(`Returning Clients: ${data.returningClients}`, 20, 80);

    // Top Visiting Clients Table
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Top Visiting Clients', 20, 100);

    const clientData = data.topVisitingClients.map(client => [
      client.clientName,
      client.totalVisits.toString(),
      client.lastVisit,
      client.totalSpent.toFixed(2),
      client.pets.join(', ')
    ]);

    autoTable(pdf, {
      startY: 110,
      head: [['Client Name', 'Total Visits', 'Last Visit', 'Total Spent', 'Pets']],
      body: clientData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [71, 85, 105] }
    });

    // Save PDF
    const filename = `client_report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  }

  private generateEarningsPDFReport(data: EarningsReport, filters?: ReportFilters): void {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40);
    pdf.text('EARNINGS REPORT', 20, 30);

    // Summary
    pdf.setFontSize(12);
    pdf.text(`Total Revenue: Rs.${data.totalRevenue.toFixed(2)}`, 20, 50);
    pdf.text(`Total Paid: Rs.${data.totalPaidAmount.toFixed(2)}`, 20, 60);
    pdf.text(`Outstanding: Rs.${data.totalOutstandingAmount.toFixed(2)}`, 20, 70);

    // Revenue by Service
    pdf.setFontSize(14);
    pdf.setTextColor(40);
    pdf.text('Revenue by Service', 20, 90);

    const serviceData = data.revenueByService.map(service => [
      service.serviceName,
      service.revenue.toFixed(2),
      service.appointments.toString(),
      service.averagePrice.toFixed(2),
      `${service.percentageOfTotal.toFixed(1)}%`
    ]);

    autoTable(pdf, {
      startY: 100,
      head: [['Service', 'Revenue', 'Appointments', 'Avg Price', '% of Total']],
      body: serviceData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [71, 85, 105] }
    });

    // Save PDF
    const filename = `earnings_report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  }

  // ============ UTILITY METHODS ============

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  }
} 