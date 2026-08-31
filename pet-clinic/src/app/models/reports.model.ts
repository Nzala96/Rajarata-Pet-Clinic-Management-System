export interface AppointmentStatistics {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  todayAppointments: number;
  thisWeekAppointments: number;
  thisMonthAppointments: number;
  appointmentsByStatus: { [key: string]: number };
  appointmentsByDoctor: { [key: string]: number };
  appointmentsByMonth: { [key: string]: number };
  averageAppointmentsPerDay: number;
  appointmentTrends: AppointmentTrend[];
}

export interface AppointmentTrend {
  date: string;
  count: number;
  status: string;
}

export interface ClientVisitFrequency {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  returningClients: number;
  clientVisitStats: ClientVisitStat[];
  topVisitingClients: TopVisitingClient[];
  clientRetentionRate: number;
  averageVisitsPerClient: number;
}

export interface ClientVisitStat {
  clientId: number;
  clientName: string;
  email: string;
  totalVisits: number;
  lastVisit: string;
  firstVisit: string;
  averageVisitsPerMonth: number;
  pets: PetVisitInfo[];
}

export interface PetVisitInfo {
  petId: number;
  petName: string;
  petType: string;
  totalVisits: number;
  lastVisit: string;
  commonServices: string[];
}

export interface TopVisitingClient {
  clientId: number;
  clientName: string;
  totalVisits: number;
  lastVisit: string;
  totalSpent: number;
  pets: string[];
}

export interface EarningsReport {
  totalRevenue: number;
  totalPaidAmount: number;
  totalOutstandingAmount: number;
  monthlyRevenue: MonthlyRevenue[];
  revenueByService: RevenueByService[];
  revenueByDoctor: RevenueByDoctor[];
  paymentMethodBreakdown: PaymentMethodBreakdown[];
  outstandingInvoices: OutstandingInvoice[];
  revenueTrends: RevenueTrend[];
  averageInvoiceAmount: number;
  profitMargin: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  appointments: number;
  invoices: number;
  growth: number; // percentage growth from previous month
}

export interface RevenueByService {
  serviceName: string;
  revenue: number;
  appointments: number;
  averagePrice: number;
  percentageOfTotal: number;
}

export interface RevenueByDoctor {
  doctorName: string;
  revenue: number;
  appointments: number;
  averageRevenuePerAppointment: number;
  percentageOfTotal: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface OutstandingInvoice {
  invoiceId: number;
  invoiceNumber: string;
  patientName: string;
  amount: number;
  daysOverdue: number;
  dueDate: string;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  appointments: number;
}

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  doctorId?: number;
  serviceId?: number;
  clientId?: number;
  status?: string;
  paymentStatus?: string;
}

export interface ReportExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  dateRange: string;
  sections: string[];
} 