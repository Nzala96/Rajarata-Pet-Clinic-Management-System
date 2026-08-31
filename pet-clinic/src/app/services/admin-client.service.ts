import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Database response interfaces
export interface UserDB {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean | string; // Can be boolean or string from database
  created_at?: string;
  updated_at?: string;
}

// Pet database response interface
export interface PetDB {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender?: string;
  email: string; // Owner's email
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  registrationDate?: string;
  createdAt?: string;
  updatedAt?: string;
  pets?: Pet[];
  totalPets?: number;
}

export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender?: string;
  email: string;
  registrationDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactInfo {
  id: number;
  clientId: number;
  type: 'primary' | 'secondary' | 'emergency';
  contactMethod: 'email' | 'phone' | 'address';
  value: string;
  label?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientFilters {
  searchTerm?: string;
  isAdmin?: boolean;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  hasPets?: boolean;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

export interface ClientStatistics {
  totalClients: number;
  adminClients: number;
  regularClients: number;
  newClientsThisMonth: number;
  totalPetsOwned: number;
  averagePetsPerClient: number;
  clientsWithMultiplePets: number;
  recentRegistrations: Client[];
  topClientsByPets: Client[];
}

export interface VisitHistory {
  id: number;
  clientId: number;
  petId?: number;
  visitDate: string;
  visitType: string;
  veterinarian: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  cost?: number;
  status: 'completed' | 'scheduled' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class AdminClientService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    })
  };

  constructor(private http: HttpClient) {}

  // ===== CLIENT CRUD OPERATIONS =====

  /**
   * Get all users from database with their pets
   */
  getClients(filters?: ClientFilters, page?: number, limit?: number): Observable<{
    clients: Client[];
    total: number;
    page: number;
    limit: number;
  }> {
    // First get all users
    const usersUrl = `${this.apiUrl}/users`;
    const petsUrl = `${this.apiUrl}/pets`;
    
    return this.http.get<UserDB[]>(usersUrl, this.httpOptions).pipe(
      map(users => {
        console.log('Raw users from database:', users);
        
        // Convert Laravel users to our Client interface
        const clients = users.map(user => {
          const isAdmin = this.convertToBoolean(user.isAdmin);
          console.log(`User ${user.name} (${user.email}): isAdmin = ${user.isAdmin} (type: ${typeof user.isAdmin}) -> converted to: ${isAdmin}`);
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: isAdmin,
            registrationDate: user.created_at,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            pets: [],
            totalPets: 0
          };
        });

        // Apply filters on frontend
        let filteredClients = [...clients];
        
        if (filters) {
          if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            filteredClients = filteredClients.filter(client =>
              client.name.toLowerCase().includes(searchTerm) ||
              client.email.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters.isAdmin !== undefined) {
            filteredClients = filteredClients.filter(client => client.isAdmin === filters.isAdmin);
          }
        }

        // Handle pagination on frontend
        const total = filteredClients.length;
        const startIndex = ((page || 1) - 1) * (limit || 10);
        const endIndex = startIndex + (limit || 10);
        const paginatedClients = filteredClients.slice(startIndex, endIndex);

        return {
          clients: paginatedClients,
          total: total,
          page: page || 1,
          limit: limit || 10
        };
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

  /**
   * Get user by ID with their pets
   */
  getClientById(id: number): Observable<Client> {
    const userUrl = `${this.apiUrl}/users/${id}`;
    const petsUrl = `${this.apiUrl}/pets`;
    
    return this.http.get<UserDB>(userUrl, this.httpOptions).pipe(
      map(user => {
        const client: Client = {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: this.convertToBoolean(user.isAdmin),
          registrationDate: user.created_at,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          pets: [],
          totalPets: 0
        };
        
        return client;
      }),
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        throw error;
      })
    );
  }

  /**
   * Update user
   */
  updateClient(id: number, clientData: UpdateClientRequest): Observable<Client> {
    const url = `${this.apiUrl}/updateuser/${id}`;
    return this.http.put<UserDB>(url, clientData, this.httpOptions).pipe(
      map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: this.convertToBoolean(user.isAdmin),
        registrationDate: user.created_at,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        pets: [],
        totalPets: 0
      })),
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }

  /**
   * Delete user
   */
  deleteClient(id: number): Observable<{success: boolean; message: string}> {
    const url = `${this.apiUrl}/deleteuser/${id}`;
    return this.http.delete<{success: boolean; message: string}>(url, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        throw error;
      })
    );
  }

  /**
   * Search users
   */
  searchClients(searchTerm: string): Observable<Client[]> {
    const url = `${this.apiUrl}/users`;
    return this.http.get<UserDB[]>(url, this.httpOptions).pipe(
      map(users => {
        const filteredUsers = users.filter(user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return filteredUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: this.convertToBoolean(user.isAdmin),
          registrationDate: user.created_at,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          pets: [],
          totalPets: 0
        }));
      }),
      catchError(error => {
        console.error('Error searching users:', error);
        throw error;
      })
    );
  }

  /**
   * Get user's pets by email
   */
  getClientPets(email: string): Observable<Pet[]> {
    const url = `${this.apiUrl}/pets`;
    return this.http.get<PetDB[]>(url, this.httpOptions).pipe(
      map(pets => {
        const userPets = pets.filter(pet => pet.email === email);
        return userPets.map(pet => ({
          id: pet.id,
          name: pet.name,
          type: pet.type,
          breed: pet.breed,
          age: pet.age,
          gender: pet.gender,
          email: pet.email,
          registrationDate: pet.created_at,
          createdAt: pet.created_at,
          updatedAt: pet.updated_at
        }));
      }),
      catchError(error => {
        console.error('Error fetching user pets:', error);
        throw error;
      })
    );
  }

  /**
   * Get all pets for all users
   */
  getAllPets(): Observable<Pet[]> {
    const url = `${this.apiUrl}/pets`;
    return this.http.get<PetDB[]>(url, this.httpOptions).pipe(
      map(pets => pets.map(pet => ({
        id: pet.id,
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        email: pet.email,
        registrationDate: pet.created_at,
        createdAt: pet.created_at,
        updatedAt: pet.updated_at
      }))),
      catchError(error => {
        console.error('Error fetching all pets:', error);
        throw error;
      })
    );
  }

  /**
   * Get users with their pets count
   */
  getClientsWithPets(filters?: ClientFilters, page?: number, limit?: number): Observable<{
    clients: Client[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Get users and pets separately, then combine them
    const usersUrl = `${this.apiUrl}/users`;
    const petsUrl = `${this.apiUrl}/pets`;
    
    return this.http.get<UserDB[]>(usersUrl, this.httpOptions).pipe(
      map(users => {
        // Convert users to clients
        const clients = users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: this.convertToBoolean(user.isAdmin),
          registrationDate: user.created_at,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          pets: [],
          totalPets: 0
        }));

        // Apply filters
        let filteredClients = [...clients];
        
        if (filters) {
          if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            filteredClients = filteredClients.filter(client =>
              client.name.toLowerCase().includes(searchTerm) ||
              client.email.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters.isAdmin !== undefined) {
            filteredClients = filteredClients.filter(client => client.isAdmin === filters.isAdmin);
          }
        }

        // Handle pagination
        const total = filteredClients.length;
        const startIndex = ((page || 1) - 1) * (limit || 10);
        const endIndex = startIndex + (limit || 10);
        const paginatedClients = filteredClients.slice(startIndex, endIndex);

        return {
          clients: paginatedClients,
          total: total,
          page: page || 1,
          limit: limit || 10
        };
      }),
      catchError(error => {
        console.error('Error fetching users with pets:', error);
        throw error;
      })
    );
  }

  /**
   * Get client statistics
   */
  getClientStatistics(): Observable<ClientStatistics> {
    const usersUrl = `${this.apiUrl}/users`;
    const petsUrl = `${this.apiUrl}/pets`;
    
    return this.http.get<UserDB[]>(usersUrl, this.httpOptions).pipe(
      map(users => {
        const totalClients = users.length;
        const adminClients = users.filter(user => this.convertToBoolean(user.isAdmin)).length;
        const regularClients = totalClients - adminClients;
        
        // Calculate new clients this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newClientsThisMonth = users.filter(user => {
          const userDate = new Date(user.created_at || '');
          return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length;

        return {
          totalClients,
          adminClients,
          regularClients,
          newClientsThisMonth,
          totalPetsOwned: 0, // Will be calculated when pets are loaded
          averagePetsPerClient: 0,
          clientsWithMultiplePets: 0,
          recentRegistrations: users.slice(0, 5).map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: this.convertToBoolean(user.isAdmin),
            registrationDate: user.created_at,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            pets: [],
            totalPets: 0
          })),
          topClientsByPets: []
        };
      }),
      catchError(error => {
        console.error('Error fetching client statistics:', error);
        throw error;
      })
    );
  }

  /**
   * Get cities (placeholder - not applicable for users)
   */
  getCities(): Observable<string[]> {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  /**
   * Get states (placeholder - not applicable for users)
   */
  getStates(): Observable<string[]> {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  /**
   * Export clients to CSV
   */
  exportClientsToCSV(filters?: ClientFilters): Observable<Blob> {
    const usersUrl = `${this.apiUrl}/users`;
    
    return this.http.get<UserDB[]>(usersUrl, this.httpOptions).pipe(
      map(users => {
        // Convert users to CSV format
        const csvData = users.map(user => ({
          'ID': user.id,
          'Name': user.name,
          'Email': user.email,
          'Is Admin': this.convertToBoolean(user.isAdmin) ? 'Yes' : 'No',
          'Registration Date': user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'
        }));

        // Convert to CSV string
        const headers = Object.keys(csvData[0]);
        const csvString = [
          headers.join(','),
          ...csvData.map(row => headers.map(header => `"${(row as any)[header]}"`).join(','))
        ].join('\n');

        // Create blob
        const blob = new Blob([csvString], { type: 'text/csv' });
        return blob;
      }),
      catchError(error => {
        console.error('Error exporting clients:', error);
        throw error;
      })
    );
  }

  private convertToBoolean(value: any): boolean {
    console.log(`Converting to boolean: ${value} (type: ${typeof value})`);
    
    if (value === null || value === undefined) {
      return false;
    }
    
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
        return true;
      }
      if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
        return false;
      }
    }
    
    if (typeof value === 'number') {
      return value !== 0;
    }
    
    // Default to false for any other type
    return false;
  }
} 