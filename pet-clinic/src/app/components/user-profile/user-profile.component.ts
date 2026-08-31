import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile } from '../../services/user.service';
import { AuthService } from '../../auth.service';
import { UserAppointmentService, UserAppointment } from '../../services/user-appointment.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private apiUrl = 'http://localhost:8000/api';
  
  user: UserProfile = {
    name: '',
    email: '',
    phone: '',
    contactNumber: ''
  };
  
  editingUser: boolean = false;
  loading: boolean = false;
  loadingAppointments: boolean = false;
  editedUser: UserProfile = { ...this.user };
  
  // Upcoming appointments
  upcomingAppointments: UserAppointment[] = [];
  
  // Messages
  successMessage: string = '';
  errorMessage: string = '';
  
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appointmentService: UserAppointmentService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadUpcomingAppointments();
  }

  loadUserProfile() {
    const userEmail = this.authService.getUserEmail();
    if (userEmail) {
      this.loading = true;
      this.userService.getUserProfile(userEmail).subscribe(
        (profile: UserProfile) => {
          this.user = profile;
          this.editedUser = { ...profile };
          this.loading = false;
        },
        (error) => {
          console.error('Error loading user profile:', error);
          this.loading = false;
          this.showError('Failed to load user profile');
        }
      );
    }
  }

  loadUpcomingAppointments() {
    const userEmail = this.authService.getUserEmail();
    if (userEmail) {
      this.loadingAppointments = true;
      this.appointmentService.getUserAppointments(userEmail).subscribe(
        (appointments: UserAppointment[]) => {
          // Filter for upcoming appointments (future dates and not cancelled)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          this.upcomingAppointments = appointments
            .filter(appt => {
              const appointmentDate = new Date(appt.date);
              return appointmentDate >= today && appt.status !== 'cancelled';
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5); // Show only next 5 appointments
          
          this.loadingAppointments = false;
        },
        (error) => {
          console.error('Error loading appointments:', error);
          this.loadingAppointments = false;
        }
      );
    }
  }

  startEditUser() {
    this.editedUser = { ...this.user };
    this.editingUser = true;
    this.clearMessages();
  }

  saveEditUser() {
    if (!this.validateUserForm()) {
      return;
    }

    // Check if email is being changed and if it already exists
    const userEmail = this.authService.getUserEmail();
    if (userEmail && this.editedUser.email && this.editedUser.email !== userEmail) {
      // Show confirmation for email change
      if (!confirm(`Are you sure you want to change your email from "${userEmail}" to "${this.editedUser.email}"? This will update all your appointments.`)) {
        return;
      }
      
      this.checkEmailExists(this.editedUser.email, userEmail).subscribe(
        (emailExists) => {
          if (emailExists) {
            this.showError('This email address is already in use. Please choose a different email.');
            return;
          }
          this.performUpdate();
        },
        (error) => {
          console.error('Error checking email:', error);
          this.performUpdate(); // Proceed with update if check fails
        }
      );
    } else {
      this.performUpdate();
    }
  }

  private performUpdate() {
    this.loading = true;
    const userEmail = this.authService.getUserEmail();
    
    if (userEmail) {
      this.userService.updateUserProfile(userEmail, this.editedUser).subscribe(
        (response) => {
          if (response.success !== false) {
            // Update the local user object with the new data
            this.user = { ...this.editedUser };
            this.editingUser = false;
            this.loading = false;
            
            // Show success message with details
            const updatedFields = [];
            if (this.editedUser.name !== this.user.name) updatedFields.push('name');
            if (this.editedUser.email !== this.user.email) updatedFields.push('email');
            if (this.editedUser.phone !== this.user.phone) updatedFields.push('phone');
            if (this.editedUser.contactNumber !== this.user.contactNumber) updatedFields.push('contact number');
            
            const message = updatedFields.length > 0 
              ? `Profile updated successfully! Updated: ${updatedFields.join(', ')}`
              : response.message || 'Profile updated successfully!';
            
            this.showSuccess(message);
            
            // Update localStorage if name changed
            if (this.user.name !== this.authService.getUsername()) {
              localStorage.setItem('authUsername', this.user.name);
            }
            
            // Update localStorage if email changed
            if (this.editedUser.email && this.editedUser.email !== userEmail) {
              localStorage.setItem('authEmail', this.editedUser.email);
            }
            
            // Reload the profile data to ensure it's fresh
            this.loadUserProfile();
            this.loadUpcomingAppointments();
          } else {
            this.loading = false;
            this.showError(response.message || 'Failed to update profile');
          }
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.loading = false;
          this.showError('Failed to update profile');
        }
      );
    }
  }

  private checkEmailExists(newEmail: string, currentEmail: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`).pipe(
      map((appointments: any[]) => {
        // Check if any appointment uses this email (excluding current user)
        return appointments.some((appt: any) => 
          appt.email === newEmail && appt.email !== currentEmail
        );
      }),
      catchError(error => {
        console.error('Error checking email existence:', error);
        return of(false); // Assume email doesn't exist if check fails
      })
    );
  }

  cancelEditUser() {
    this.editingUser = false;
    this.editedUser = { ...this.user };
    this.clearMessages();
  }

  // Helper methods for appointments
  getAppointmentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  getAppointmentStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    return timeString;
  }

  isAppointmentToday(dateString: string): boolean {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return today.toDateString() === appointmentDate.toDateString();
  }

  isAppointmentTomorrow(dateString: string): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = new Date(dateString);
    return tomorrow.toDateString() === appointmentDate.toDateString();
  }

  getAppointmentDateDisplay(dateString: string): string {
    if (this.isAppointmentToday(dateString)) {
      return 'Today';
    } else if (this.isAppointmentTomorrow(dateString)) {
      return 'Tomorrow';
    } else {
      return this.formatDate(dateString);
    }
  }

  // Helper methods
  private validateUserForm(): boolean {
    if (!this.editedUser.name || this.editedUser.name.trim().length < 2) {
      this.showError('Name must be at least 2 characters long');
      return false;
    }
    
    if (!this.editedUser.email || !this.isValidEmail(this.editedUser.email)) {
      this.showError('Please enter a valid email address');
      return false;
    }
    
    if (this.editedUser.phone && !this.isValidPhone(this.editedUser.phone)) {
      this.showError('Please enter a valid phone number');
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getUserInitials(): string {
    if (!this.user.name) return 'U';
    return this.user.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
