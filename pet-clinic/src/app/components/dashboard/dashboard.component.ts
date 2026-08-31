import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../services/notification.service';
import { AdminDashboardService, AdminStats, TodayAppointment, AdminNotification } from '../../services/admin-dashboard.service';
import { AppointmentNotification } from '../../models/appointment-notification.model';
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

interface HealthSummary {
  pet: string;
  lastVisit: string;
  nextVaccine: string;
  notes: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';
  isAdmin: boolean = false;

  // Client dashboard data
  upcomingAppointments: Appointment[] = [];
  petHealthSummaries: HealthSummary[] = [];
  notifications: AppointmentNotification[] = [];
  private notificationSubscription: Subscription = new Subscription();

  // Admin dashboard data
  adminStats: AdminStats = {
    totalUsers: 0,
    todayAppointments: 0,
    totalAppointments: 0,
    totalPets: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  };
  todayAppointments: TodayAppointment[] = [];
  adminNotifications: AdminNotification[] = [];
  isLoadingStats = false;
  isLoadingAppointments = false;
  isLoadingNotifications = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private adminDashboardService: AdminDashboardService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();
    this.isAdmin = this.userIsAdmin === '1' || this.userIsAdmin === 'true';

    console.log('Dashboard initialized - Is Admin:', this.isAdmin);

    // Redirect to appropriate dashboard based on role
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  // Admin Dashboard Methods
  loadAdminDashboard(): void {
    this.loadAdminStats();
    this.loadTodayAppointments();
    this.loadAdminNotifications();
  }

  loadAdminStats(): void {
    this.isLoadingStats = true;
    this.adminDashboardService.getAdminStats().subscribe(
      (stats) => {
        this.adminStats = stats;
        this.isLoadingStats = false;
        console.log('Admin stats loaded:', stats);
      },
      (error) => {
        console.error('Error loading admin stats:', error);
        this.isLoadingStats = false;
      }
    );
  }

  loadTodayAppointments(): void {
    this.isLoadingAppointments = true;
    this.adminDashboardService.getTodayAppointments().subscribe(
      (appointments) => {
        this.todayAppointments = appointments;
        this.isLoadingAppointments = false;
        console.log('Today\'s appointments loaded:', appointments);
      },
      (error) => {
        console.error('Error loading today\'s appointments:', error);
        this.isLoadingAppointments = false;
      }
    );
  }

  loadAdminNotifications(): void {
    this.isLoadingNotifications = true;
    this.adminDashboardService.getAdminNotifications().subscribe(
      (notifications) => {
        this.adminNotifications = notifications;
        this.isLoadingNotifications = false;
        console.log('Admin notifications loaded:', notifications);
      },
      (error) => {
        console.error('Error loading admin notifications:', error);
        this.isLoadingNotifications = false;
      }
    );
  }

  updateAppointmentStatus(appointmentId: number, status: string): void {
    this.adminDashboardService.updateAppointmentStatus(appointmentId, status).subscribe(
      (response) => {
        if (response.success !== false) {
          // Update local data
          const appointment = this.todayAppointments.find(appt => appt.id === appointmentId);
          if (appointment) {
            appointment.status = status;
          }
          // Refresh stats
          this.loadAdminStats();
          console.log('Appointment status updated successfully');
        }
      },
      (error) => {
        console.error('Error updating appointment status:', error);
      }
    );
  }

  getCancelButtonTooltip(status: string): string {
    switch (status) {
      case 'completed':
        return 'Cannot cancel completed appointments';
      case 'cancelled':
        return 'Appointment is already cancelled';
      default:
        return 'Cancel Appointment';
    }
  }

  markAdminNotificationAsRead(notification: AdminNotification, index: number): void {
    if (notification.id) {
      this.adminDashboardService.markNotificationAsRead(notification.id).subscribe(
        (response) => {
          if (response.success !== false) {
            this.adminNotifications.splice(index, 1);
          }
        },
        (error) => {
          console.error('Error marking notification as read:', error);
        }
      );
    } else {
      // Remove from local array if no ID
      this.adminNotifications.splice(index, 1);
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'badge bg-danger';
      case 'medium':
        return 'badge bg-warning text-dark';
      case 'low':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  // Client Dashboard Methods (enhanced functionality)
  loadClientDashboard(): void {
    // Subscribe to notifications
    this.notificationSubscription = this.notificationService.getNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    this.fetchUserAppointments();
    this.loadMockHealthData();
  }

  fetchUserAppointments() {
    if (!this.useremail) {
      console.error('User email not available');
      return;
    }

    this.appointmentService.getAllAppointments().subscribe(
      (data: any[]) => {
        const now = new Date();

        // Filter appointments by user email and future dates
        this.upcomingAppointments = data
          .filter(appt => {
            const apptDate = new Date(appt.date);
            return appt.email === this.useremail && apptDate >= now;
          })
          .map(appt => {
            const dt = new Date(appt.date);
            return {
              ...appt,
              date: dt.toISOString().split('T')[0],
              time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
              formattedDate: dt.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            };
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        this.fetchUserNotifications();
      },
      (err) => {
        console.error('Error fetching user appointments', err);
        this.fetchUserNotifications();
      }
    );
  }

  fetchUserNotifications() {
    if (this.useremail) {
      this.appointmentService.getNotificationsByUser(this.useremail).subscribe(
        (data: AppointmentNotification[]) => {
          this.notificationService.setNotifications(data);
        },
        (err) => {
          console.error('Error loading user-specific notifications', err);
          this.fetchGeneralNotifications();
        }
      );
    } else {
      this.fetchGeneralNotifications();
    }
  }

  fetchGeneralNotifications() {
    this.appointmentService.getNotifications().subscribe(
      (data: AppointmentNotification[]) => {
        this.notificationService.setNotifications(data);
      },
      (err) => {
        console.error('Error loading general notifications', err);
        this.generateNotificationsFromAppointments();
      }
    );
  }

  generateNotificationsFromAppointments() {
    const generatedNotifications: AppointmentNotification[] = [];
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.upcomingAppointments.forEach(appt => {
      const apptDate = new Date(appt.date);
      
      if (apptDate.toDateString() === tomorrow.toDateString()) {
        generatedNotifications.push({
          message: `Reminder: ${appt.petname} has an appointment tomorrow at ${appt.time} with ${appt.docname}`,
          type: 'reminder',
          date: now.toISOString().split('T')[0]
        });
      }
      
      if (apptDate >= now && apptDate <= nextWeek) {
        generatedNotifications.push({
          message: `Upcoming: ${appt.petname} appointment on ${appt.date} at ${appt.time}`,
          type: 'info',
          date: now.toISOString().split('T')[0]
        });
      }
    });

    this.notificationService.setNotifications(generatedNotifications);
  }

  loadMockHealthData() {
    this.petHealthSummaries = [
      { pet: 'Buddy', lastVisit: '2024-05-10', nextVaccine: '2024-07-01', notes: 'Healthy, next vaccine due soon.' },
      { pet: 'Milo', lastVisit: '2024-05-15', nextVaccine: '2024-08-10', notes: 'Monitor weight, next checkup in August.' }
    ];
  }

  // Common methods
  refreshDashboard() {
    if (this.isAdmin) {
      this.loadAdminDashboard();
    } else {
      this.loadClientDashboard();
    }
  }

  markNotificationAsRead(index: number) {
    this.notificationService.dismissNotification(index);
  }

  // Enhanced client dashboard methods
  getUpcomingAppointmentsCount(): number {
    return this.upcomingAppointments.length;
  }

  getNextAppointment(): any {
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
      case 'cancelled':
        return 'badge bg-danger';
      case 'completed':
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  }

  getUrgencyClass(appointmentDate: string): string {
    const daysUntil = this.getDaysUntilAppointment(appointmentDate);
    if (daysUntil <= 1) return 'text-danger fw-bold';
    if (daysUntil <= 3) return 'text-warning fw-bold';
    return 'text-muted';
  }

  // Date helper methods for template
  getDateDay(dateString: string): number {
    return new Date(dateString).getDate();
  }

  getDateMonth(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
