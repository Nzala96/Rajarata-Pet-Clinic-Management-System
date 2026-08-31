import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  createdAt?: string;
  updatedAt?: string;
  petAge?: string;
  petBreed?: string;
  reasonForVisit?: string;
}

export interface CreateUserAppointmentRequest {
  date: string;
  time: string;
  petname: string;
  docname: string;
  name: string;
  email: string;
  contactNumber?: string;
  appointmentType?: string;
  notes?: string;
  petAge?: string;
  petBreed?: string;
  reasonForVisit?: string;
}

export interface UpdateUserAppointmentRequest {
  date?: string;
  time?: string;
  petname?: string;
  docname?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  appointmentType?: string;
  notes?: string;
  petAge?: string;
  petBreed?: string;
  reasonForVisit?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization?: string;
  email?: string;
  phone?: string;
  available?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserAppointmentService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}


  getUserAppointments(userEmail: string): Observable<UserAppointment[]> {
    
    return this.http.get<any[]>(`${this.apiUrl}/appointments`).pipe(
      map(appointments => 
        appointments
          .filter(appt => appt.email === userEmail)
          .map(appt => ({
            id: appt.id,
            date: appt.date,
            time: appt.time,
            petname: appt.petname,
            docname: appt.docname,
            name: appt.name,
            email: appt.email,
            status: appt.status || 'pending',
            contactNumber: appt.contactNumber || appt.tp,
            appointmentType: appt.appointmentType,
            notes: appt.notes || appt.message,
            createdAt: appt.created_at,
            updatedAt: appt.updated_at,
            petAge: appt.petAge,
            petBreed: appt.petBreed,
            reasonForVisit: appt.reasonForVisit
          } as UserAppointment))
      ),
              catchError(error => {
          console.error('Error fetching user appointments:', error);
        return of([]);
      })
    );
  }


  getAppointmentById(appointmentId: number): Observable<UserAppointment> {
    return this.http.get<UserAppointment>(`${this.apiUrl}/appointments/${appointmentId}`).pipe(
      catchError(error => {
        console.error('Error fetching appointment:', error);
        return of({} as UserAppointment);
      })
    );
  }


  createAppointment(appointmentData: CreateUserAppointmentRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/addappointment`, appointmentData).pipe(
      catchError(error => {
        console.error('Error creating appointment:', error);
        return of({ success: false, message: 'Failed to create appointment' });
      })
    );
  }


  updateAppointment(appointmentId: number, appointmentData: UpdateUserAppointmentRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateappointments/${appointmentId}`, appointmentData).pipe(
      catchError(error => {
        console.error('Error updating appointment:', error);
        return of({ success: false, message: 'Failed to update appointment' });
      })
    );
  }


  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateappointments/${appointmentId}`, { status: 'cancelled' }).pipe(
      catchError(error => {
        console.error('Error cancelling appointment:', error);
        return of({ success: false, message: 'Failed to cancel appointment' });
      })
    );
  }


  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`).pipe(
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return of([]);
      })
    );
  }


} 