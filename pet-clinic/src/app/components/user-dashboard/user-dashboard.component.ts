import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { UserDashboardService, UserNotification, UserAppointment, PetHealthSummary } from '../../services/user-dashboard.service';
import { Subscription } from 'rxjs';

interface Appointment {
  date: string;
  time: string;
  petname: string;
  docname: string;
  name: string;
  status?: string;
  appointmentType?: string;
  formattedDate?: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';

  // Client dashboard data
  upcomingAppointments: UserAppointment[] = [];
  petHealthSummaries: PetHealthSummary[] = [];
  notifications: UserNotification[] = [];
  private notificationSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentService,
    private userDashboardService: UserDashboardService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();

    // Redirect if admin
    if (this.userIsAdmin === '1' || this.userIsAdmin === 'true') {
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    console.log('User Dashboard initialized');
    this.loadClientDashboard();
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  loadClientDashboard(): void {
    // Subscribe to user-specific notifications
    this.notificationSubscription = this.userDashboardService.getUserNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
        console.log('User notifications loaded:', notifications);
      });

    this.fetchUserAppointments();
    this.loadPetHealthData();
  }

  fetchUserAppointments() {
    this.userDashboardService.getUpcomingAppointments().subscribe(
      (appointments: UserAppointment[]) => {
        this.upcomingAppointments = appointments.map(appt => {
          const dt = new Date(appt.date);
          return {
            ...appt,
            formattedDate: dt.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          };
        });

        console.log('User appointments loaded:', this.upcomingAppointments);
      },
      (error) => {
        console.error('Error fetching user appointments:', error);
      }
    );
  }

  loadPetHealthData() {
    this.userDashboardService.getPetHealthSummaries().subscribe(
      (summaries: PetHealthSummary[]) => {
        this.petHealthSummaries = summaries;
      },
      (error) => {
        console.error('Error fetching pet health data:', error);
      }
    );
  }

  refreshDashboard() {
    this.loadClientDashboard();
  }

  markNotificationAsRead(index: number) {
    this.notifications.splice(index, 1);
  }

  getUpcomingAppointmentsCount(): number {
    return this.upcomingAppointments.length;
  }

  getNextAppointment(): UserAppointment | null {
    return this.upcomingAppointments.length > 0 ? this.upcomingAppointments[0] : null;
  }

  getAppointmentsByStatus(status: string): number {
    return this.upcomingAppointments.filter(appt => appt.status === status).length;
  }

  getDaysUntilAppointment(appointmentDate: string): number {
    const today = new Date();
    const apptDate = new Date(appointmentDate);
    const diffTime = apptDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStatusBadgeClassForClient(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'completed':
        return 'badge bg-info';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getUrgencyClass(appointmentDate: string): string {
    const daysUntil = this.getDaysUntilAppointment(appointmentDate);
    if (daysUntil <= 1) return 'text-danger fw-bold';
    if (daysUntil <= 3) return 'text-warning fw-bold';
    return 'text-success';
  }

  getDateDay(dateString: string): number {
    return new Date(dateString).getDate();
  }

  getDateMonth(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToAppointments(): void {
    this.router.navigate(['/appointments']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
} 