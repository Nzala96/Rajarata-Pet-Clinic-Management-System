export interface Invoice {
  id?: number;
  invoice_number: string;
  appointment_id?: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  pet_name?: string;
  doctor_name: string;
  service_name: string;
  service_description?: string;
  service_price: number;
  additional_charges?: number;
  discount?: number;
  tax_rate: number;
  tax_amount: number;
  subtotal: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  payment_date?: string;
  due_date: string;
  issue_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id?: number;
  invoice_id: number;
  service_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Payment {
  id?: number;
  invoice_id: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  transaction_id?: string;
  reference_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BillingSearchFilters {
  search?: string;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  date_range?: {
    start: string;
    end: string;
  };
  amount_range?: {
    min: number;
    max: number;
  };
}

export interface CreateInvoiceRequest {
  appointment_id?: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  pet_name?: string;
  doctor_name: string;
  service_name: string;
  service_description?: string;
  service_price: number;
  additional_charges?: number;
  discount?: number;
  tax_rate: number;
  due_date: string;
  notes?: string;
}

export interface UpdateInvoiceRequest {
  id: number;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
  pet_name?: string;
  doctor_name?: string;
  service_name?: string;
  service_description?: string;
  service_price?: number;
  additional_charges?: number;
  discount?: number;
  tax_rate?: number;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  payment_date?: string;
  due_date?: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  invoice_id: number;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  transaction_id?: string;
  reference_number?: string;
  notes?: string;
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  DIGITAL_WALLET = 'digital_wallet',
  INSURANCE = 'insurance'
}

export interface BillingStatistics {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  averageInvoiceAmount: number;
  monthlyRevenue: number;
  paymentMethodBreakdown: {
    method: PaymentMethod;
    count: number;
    total: number;
  }[];
  recentInvoices: Invoice[];
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: 'Unpaid',
  [PaymentStatus.PARTIALLY_PAID]: 'Partially Paid',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.OVERDUE]: 'Overdue',
  [PaymentStatus.CANCELLED]: 'Cancelled'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CREDIT_CARD]: 'Credit Card',
  [PaymentMethod.DEBIT_CARD]: 'Debit Card',
  [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethod.CHECK]: 'Check',
  [PaymentMethod.DIGITAL_WALLET]: 'Digital Wallet',
  [PaymentMethod.INSURANCE]: 'Insurance'
};

export const TAX_RATES = [
  { label: 'No Tax (0%)', value: 0 },
  { label: 'Standard Tax (8%)', value: 8 },
  { label: 'Service Tax (10%)', value: 10 },
  { label: 'Premium Tax (15%)', value: 15 }
]; 