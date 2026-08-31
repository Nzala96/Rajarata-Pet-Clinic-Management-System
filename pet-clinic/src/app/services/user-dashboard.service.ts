import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UserNotification {
  id: string;
  message: string;
  type: 'appointment' | 'alert' | 'info' | 'reminder';
  date: string;
  appointmentId?: number;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface UserAppointment {
  id: number;
  date: string;
  time: string;
  petname: string;
  docname: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  contactNumber?: string;
  appointmentType?: string;
  notes?: string;
  petAge?: string;
  petBreed?: string;
  reasonForVisit?: string;
  formattedDate?: string;
}

export interface PetHealthSummary {
  pet: string;
  lastVisit: string;
  nextVaccine: string;
  notes: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'needs_attention';
}

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}


  getUserNotifications(): Observable<UserNotification[]> {
    return this.http.get<UserNotification[]>(`${this.apiUrl}/user/notifications`).pipe(
      catchError(error => {
        console.error('Error fetching user notifications:', error);
        return this.getFallbackUserNotifications();
      })
    );
  }


  getUserAppointments(): Observable<UserAppointment[]> {
    return this.http.get<UserAppointment[]>(`${this.apiUrl}/appointments`).pipe(
      map(appointments => {

        return appointments.map(appt => ({
          id: appt.id,
          date: appt.date,
          time: appt.time,
          petname: appt.petname,
          docname: appt.docname,
          name: appt.name,
          email: appt.email,
          status: appt.status || 'pending',
          contactNumber: appt.contactNumber,
          appointmentType: appt.appointmentType,
          notes: appt.notes,
          petAge: appt.petAge,
          petBreed: appt.petBreed,
          reasonForVisit: appt.reasonForVisit
        }));
      }),
      catchError(error => {
        console.error('Error fetching user appointments:', error);
        return of([]);
      })
    );
  }


  getUpcomingAppointments(): Observable<UserAppointment[]> {
    return this.getUserAppointments().pipe(
      map(appointments => {
        const now = new Date();
        return appointments
          .filter(appt => {
            const apptDate = new Date(appt.date);
            return apptDate >= now;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);
      })
    );
  }


  getPetHealthSummaries(): Observable<PetHealthSummary[]> {
    
    return of([
      {
        pet: 'Buddy',
        lastVisit: '2024-01-15',
        nextVaccine: '2024-04-15',
        notes: 'Healthy, weight stable',
        healthStatus: 'excellent'
      },
      {
        pet: 'Luna',
        lastVisit: '2024-02-01',
        nextVaccine: '2024-05-01',
        notes: 'Dental cleaning recommended',
        healthStatus: 'good'
      }
    ]);
  }


  markNotificationAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/notifications/${notificationId}/read`, {}).pipe(
      catchError(error => {
        console.error('Error marking notification as read:', error);
        return of({ success: false });
      })
    );
  }


  getUserStats(): Observable<any> {
    return this.getUserAppointments().pipe(
      map(appointments => {
        const now = new Date();
        const upcoming = appointments.filter(appt => new Date(appt.date) >= now);
        const pending = appointments.filter(appt => appt.status === 'pending');
        const confirmed = appointments.filter(appt => appt.status === 'confirmed');
        const completed = appointments.filter(appt => appt.status === 'completed');

        return {
          totalAppointments: appointments.length,
          upcomingAppointments: upcoming.length,
          pendingAppointments: pending.length,
          confirmedAppointments: confirmed.length,
          completedAppointments: completed.length
        };
      }),
      catchError(error => {
        console.error('Error fetching user stats:', error);
        return of({
          totalAppointments: 0,
          upcomingAppointments: 0,
          pendingAppointments: 0,
          confirmedAppointments: 0,
          completedAppointments: 0
        });
      })
    );
  }

  
  private getFallbackUserNotifications(): Observable<UserNotification[]> {
    return of([
      {
        id: 'fallback_1',
        message: 'Welcome to your dashboard! You can view your appointments here.',
        type: 'info',
        date: new Date().toISOString().split('T')[0],
        isRead: false,
        priority: 'low'
      }
    ]);
  }
} 