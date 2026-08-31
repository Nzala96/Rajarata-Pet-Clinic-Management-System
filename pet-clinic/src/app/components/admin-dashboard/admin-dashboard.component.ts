import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { AdminDashboardService, AdminStats, TodayAppointment, AdminNotification } from '../../services/admin-dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';

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
    private adminDashboardService: AdminDashboardService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();

    // Redirect if not admin
    if (this.userIsAdmin !== '1' && this.userIsAdmin !== 'true') {
      this.router.navigate(['/user-dashboard']);
      return;
    }

    console.log('Admin Dashboard initialized');
    this.loadAdminDashboard();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions if any
  }

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

  refreshDashboard(): void {
    this.loadAdminDashboard();
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 