import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Doctor, CreateDoctorRequest, UpdateDoctorRequest, DoctorSearchFilters } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Get all doctors
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`).pipe(
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return of([]);
      })
    );
  }

  // Get doctor by ID
  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctor/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching doctor:', error);
        throw error;
      })
    );
  }

  // Create new doctor
  createDoctor(doctorData: CreateDoctorRequest): Observable<any> {
    const newDoctor = {
      ...doctorData,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    return this.http.post(`${this.apiUrl}/addDoc`, newDoctor).pipe(
      catchError(error => {
        console.error('Error creating doctor:', error);
        throw error;
      })
    );
  }

  // Update doctor
  updateDoctor(id: number, doctorData: UpdateDoctorRequest): Observable<any> {
    const updateData = {
      ...doctorData,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    return this.http.put(`${this.apiUrl}/updatedoc/${id}`, updateData).pipe(
      catchError(error => {
        console.error('Error updating doctor:', error);
        throw error;
      })
    );
  }

  // Delete doctor
  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletedoc/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting doctor:', error);
        throw error;
      })
    );
  }

  // Search doctors
  searchDoctors(filters: DoctorSearchFilters): Observable<Doctor[]> {
    return this.getDoctors().pipe(
      map(doctors => {
        let filteredDoctors = doctors;

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredDoctors = filteredDoctors.filter(doctor =>
            doctor.dname.toLowerCase().includes(searchTerm) ||
            doctor.demail.toLowerCase().includes(searchTerm) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm))
          );
        }

        if (filters.specialization) {
          filteredDoctors = filteredDoctors.filter(doctor =>
            doctor.specialization === filters.specialization
          );
        }

        if (filters.available !== undefined) {
          filteredDoctors = filteredDoctors.filter(doctor =>
            doctor.available === filters.available
          );
        }

        return filteredDoctors;
      })
    );
  }

  // Get specializations (for dropdown)
  getSpecializations(): string[] {
    return [
      'General Veterinarian',
      'Pet Surgery',
      'Pet Dentistry',
      'Exotic Animals',
      'Emergency Medicine',
      'Dermatology',
      'Cardiology',
      'Oncology',
      'Orthopedics',
      'Behavior',
      'Nutrition'
    ];
  }
} 