import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { 
  AppointmentStatistics, 
  ClientVisitFrequency, 
  EarningsReport, 
  ReportFilters 
} from '../../models/reports.model';
import { AdminAppointment } from '../../services/admin-dashboard.service';

@Component({
  selector: 'app-reports-management',
  templateUrl: './reports-management.component.html',
  styleUrls: ['./reports-management.component.scss']
})
export class ReportsManagementComponent implements OnInit {
  // Report data
  appointmentStats: AppointmentStatistics | null = null;
  clientVisitData: ClientVisitFrequency | null = null;
  earningsData: EarningsReport | null = null;
  allAppointments: AdminAppointment[] = [];

  // Loading states
  loadingAppointments = false;
  loadingClients = false;
  loadingEarnings = false;

  // Active tab
  activeTab = 'appointments';

  // Filters
  filters: ReportFilters = {};
  dateRange = '30'; // days

  // Chart data
  appointmentChartData: any[] = [];
  clientChartData: any[] = [];
  earningsChartData: any[] = [];

  // Export options
  exportFormat = 'pdf';
  includeCharts = true;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadAppointmentStatistics();
    this.loadClientVisitFrequency();
    this.loadEarningsReport();
    this.loadAllAppointments();
  }

  // ============ LOAD DATA METHODS ============

  loadAppointmentStatistics(): void {
    this.loadingAppointments = true;
    this.reportsService.getAppointmentStatistics(this.filters).subscribe({
      next: (data) => {
        this.appointmentStats = data;
        this.prepareAppointmentChartData();
        this.loadingAppointments = false;
      },
      error: (error) => {
        console.error('Error loading appointment statistics:', error);
        this.loadingAppointments = false;
      }
    });
  }

  loadAllAppointments(): void {
    this.reportsService.getAllAppointmentsForReport(this.filters).subscribe({
      next: (appointments) => {
        this.allAppointments = appointments;
      },
      error: (error) => {
        console.error('Error loading all appointments:', error);
        this.allAppointments = [];
      }
    });
  }

  loadClientVisitFrequency(): void {
    this.loadingClients = true;
    this.reportsService.getClientVisitFrequency(this.filters).subscribe({
      next: (data) => {
        this.clientVisitData = data;
        this.prepareClientChartData();
        this.loadingClients = false;
      },
      error: (error) => {
        console.error('Error loading client visit frequency:', error);
        this.loadingClients = false;
      }
    });
  }

  loadEarningsReport(): void {
    this.loadingEarnings = true;
    this.reportsService.getEarningsReport(this.filters).subscribe({
      next: (data) => {
        this.earningsData = data;
        this.prepareEarningsChartData();
        this.loadingEarnings = false;
      },
      error: (error) => {
        console.error('Error loading earnings report:', error);
        this.loadingEarnings = false;
      }
    });
  }

  // ============ CHART DATA PREPARATION ============

  prepareAppointmentChartData(): void {
    if (!this.appointmentStats) return;

    // Status breakdown chart
    this.appointmentChartData = [
      {
        name: 'Appointments by Status',
        data: Object.entries(this.appointmentStats.appointmentsByStatus).map(([status, count]) => ({
          name: this.capitalizeFirst(status),
          value: count
        }))
      },
      {
        name: 'Appointments by Doctor',
        data: Object.entries(this.appointmentStats.appointmentsByDoctor).map(([doctor, count]) => ({
          name: doctor,
          value: count
        }))
      },
      {
        name: 'Monthly Trends',
        data: this.appointmentStats.appointmentTrends.map(trend => ({
          name: this.formatDate(trend.date),
          value: trend.count
        }))
      }
    ];
  }

  prepareClientChartData(): void {
    if (!this.clientVisitData) return;

    this.clientChartData = [
      {
        name: 'Top Visiting Clients',
        data: this.clientVisitData.topVisitingClients.slice(0, 10).map(client => ({
          name: client.clientName,
          value: client.totalVisits
        }))
      },
      {
        name: 'Client Distribution',
        data: [
          { name: 'Active Clients', value: this.clientVisitData.activeClients },
          { name: 'New This Month', value: this.clientVisitData.newClientsThisMonth },
          { name: 'Returning Clients', value: this.clientVisitData.returningClients }
        ]
      }
    ];
  }

  prepareEarningsChartData(): void {
    if (!this.earningsData) return;

    this.earningsChartData = [
      {
        name: 'Monthly Revenue',
        data: this.earningsData.monthlyRevenue.map(month => ({
          name: month.month,
          value: month.revenue
        }))
      },
      {
        name: 'Revenue by Service',
        data: this.earningsData.revenueByService.map(service => ({
          name: service.serviceName,
          value: service.revenue
        }))
      },
      {
        name: 'Revenue by Doctor',
        data: this.earningsData.revenueByDoctor.map(doctor => ({
          name: doctor.doctorName,
          value: doctor.revenue
        }))
      }
    ];
  }

  // ============ FILTER METHODS ============

  onDateRangeChange(): void {
    const days = parseInt(this.dateRange);
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    this.filters = {
      ...this.filters,
      dateFrom: startDate.toISOString().split('T')[0],
      dateTo: endDate
    };

    this.refreshAllReports();
  }

  onFilterChange(): void {
    this.refreshAllReports();
  }

  clearFilters(): void {
    this.filters = {};
    this.dateRange = '30';
    this.refreshAllReports();
  }

  refreshAllReports(): void {
    this.loadAppointmentStatistics();
    this.loadClientVisitFrequency();
    this.loadEarningsReport();
    this.loadAllAppointments();
  }

  // ============ TAB METHODS ============

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // ============ EXPORT METHODS ============

  exportReport(): void {
    const reportType = this.activeTab as 'appointments' | 'clients' | 'earnings';
    
    this.reportsService.exportReport(reportType, this.filters).subscribe({
      next: (data) => {
        console.log(`${reportType} report exported successfully`);
        // The PDF will be automatically downloaded by the service
      },
      error: (error) => {
        console.error('Error exporting report:', error);
        alert('Error exporting report. Please try again.');
      }
    });
  }

  private downloadReport(data: any, reportType: string): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${reportType}_report_${timestamp}.${this.exportFormat}`;
    
    if (this.exportFormat === 'pdf') {
      // PDF is now handled by the service
      console.log('PDF report generated successfully');
    } else if (this.exportFormat === 'excel') {
      // In a real implementation, you would generate Excel here
      console.log('Excel export would be generated for:', filename);
      alert(`Excel report "${filename}" would be downloaded.`);
    } else if (this.exportFormat === 'csv') {
      // In a real implementation, you would generate CSV here
      console.log('CSV export would be generated for:', filename);
      alert(`CSV report "${filename}" would be downloaded.`);
    }
  }

  // ============ UTILITY METHODS ============

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  // ============ CHART CONFIGURATION ============

  getChartOptions(title: string, data: any[]): any {
    return {
      chart: {
        type: 'bar',
        height: 350
      },
      title: {
        text: title
      },
      xaxis: {
        categories: data.map(item => item.name)
      },
      series: [{
        name: 'Count',
        data: data.map(item => item.value)
      }],
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
    };
  }

  // ============ OBJECT EXPOSURE FOR TEMPLATE ============

  get Object() {
    return Object;
  }
} 