import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  contactNumber?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getUserProfile(email: string): Observable<UserProfile> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`).pipe(
      map((appointments: any[]) => {
        const userAppointment = appointments.find((appt: any) => appt.email === email);
        if (userAppointment) {
          return {
            name: userAppointment.name || email.split('@')[0],
            email: email,
            phone: userAppointment.contactNumber || userAppointment.tp || '1234567890',
            contactNumber: userAppointment.contactNumber || userAppointment.tp || '1234567890'
          } as UserProfile;
        } else {
          return {
            name: email.split('@')[0] || 'User',
            email: email,
            phone: '1234567890',
            contactNumber: '1234567890'
          } as UserProfile;
        }
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        const mockProfile: UserProfile = {
          name: email.split('@')[0] || 'User',
          email: email,
          phone: '1234567890',
          contactNumber: '1234567890'
        };
        return of(mockProfile);
      })
    );
  }

  updateUserProfile(email: string, userData: Partial<UserProfile>): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`).pipe(
              map((appointments: any[]) => {
        return appointments.filter((appt: any) => appt.email === email);
      }),
      switchMap((userAppointments: any[]) => {
        if (userAppointments.length === 0) {
          return of({ 
            success: true, 
            message: 'Profile updated successfully (no appointments to update)',
            data: {
              ...userData,
              email: email,
              updated_at: new Date().toISOString()
            }
          });
        }


        const updatePromises = userAppointments.map((appointment: any) => {
          const updateData = {
            name: userData.name || appointment.name,
            email: userData.email || appointment.email,
            contactNumber: userData.phone || userData.contactNumber || appointment.contactNumber || appointment.tp
          };

          return this.http.put(`${this.apiUrl}/updateappointments/${appointment.id}`, updateData).toPromise();
        });


        return Promise.all(updatePromises).then(() => {
          return { 
            success: true, 
            message: `Profile updated successfully! Updated ${userAppointments.length} appointment(s).`,
            data: {
              ...userData,
              email: email,
              updated_at: new Date().toISOString()
            }
          };
        }).catch(error => {
          console.error('Error updating appointments:', error);
          return { 
            success: false, 
            message: 'Failed to update profile. Some appointments could not be updated.',
            error: error
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching appointments for update:', error);
        return of({ 
          success: false, 
          message: 'Failed to update profile. Could not fetch user appointments.',
          error: error
        });
      })
    );
  }


  changePassword(email: string, passwordData: PasswordChangeRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/user/change-password`, {
      email: email,
      ...passwordData
    }, { headers }).pipe(
      catchError(error => {
        console.error('Error changing password:', error);
        return of({ success: false, message: 'Failed to change password' });
      })
    );
  }


  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return of({
          name: 'Unknown User',
          email: 'unknown@example.com',
          phone: '0000000000'
        });
      })
    );
  }


  validateCurrentPassword(email: string, currentPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/user/validate-password`, {
      email: email,
      password: currentPassword
    }, { headers }).pipe(
      catchError(error => {
        console.error('Error validating password:', error);
        return of({ success: false, message: 'Failed to validate password' });
      })
    );
  }
} 