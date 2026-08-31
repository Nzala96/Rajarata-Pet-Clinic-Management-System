import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Service, CreateServiceRequest, UpdateServiceRequest, ServiceSearchFilters, SERVICE_CATEGORIES } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }


 getServices(): Observable<Service[]> {
    return this.http.get<{ success: boolean; data: Service[] }>(`${this.apiUrl}/services`).pipe(
              map(response => response.data),
      catchError(error => {
        console.error('Error fetching services:', error);
        return of([]);
      })
    );
  }


  getServiceById(id: number): Observable<Service> {
    return this.http.get<{ success: boolean; data: Service }>(`${this.apiUrl}/services/${id}`).pipe(
              map(response => response.data),
      catchError(error => {
        console.error('Error fetching service:', error);
        throw error;
      })
    );
  }


  createService(serviceData: CreateServiceRequest): Observable<any> {
    const newService = {
      ...serviceData,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    return this.http.post(`${this.apiUrl}/services`, newService).pipe(
      catchError(error => {
        console.error('Error creating service:', error);
        throw error;
      })
    );
  }


  updateService(id: number, serviceData: UpdateServiceRequest): Observable<any> {
    const updateData = {
      ...serviceData,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    return this.http.put(`${this.apiUrl}/services/${id}`, updateData).pipe(
      catchError(error => {
        console.error('Error updating service:', error);
        throw error;
      })
    );
  }


  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/services/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting service:', error);
        throw error;
      })
    );
  }


  searchServices(filters: ServiceSearchFilters): Observable<Service[]> {
    return this.getServices().pipe(
      map(services => {
        let filteredServices = services;


        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredServices = filteredServices.filter(service =>
            service.name.toLowerCase().includes(searchTerm) ||
            (service.description && service.description.toLowerCase().includes(searchTerm))
          );
        }




        if (filters.available !== undefined) {
          filteredServices = filteredServices.filter(service =>
            service.available === filters.available
          );
        }


        if (filters.priceRange) {
          filteredServices = filteredServices.filter(service =>
            service.price >= filters.priceRange!.min &&
            service.price <= filters.priceRange!.max
          );
        }

        return filteredServices;
      })
    );
  }


  getServiceCategories() {
    return SERVICE_CATEGORIES;
  }


  // getServicesByCategory(category: string): Observable<Service[]> {
  //   return this.getServices().pipe(
  //     map(services => services.filter(service => service.category === category))
  //   );
  // }


  getServiceStatistics(): Observable<any> {
    return this.getServices().pipe(
      map(services => {
        const totalServices = services.length;
        const activeServices = services.filter(s => s.available).length;
        const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);
        const avgPrice = totalServices > 0 ? totalRevenue / totalServices : 0;
        const avgDuration = totalServices > 0 ? services.reduce((sum) => sum , 0) / totalServices : 0;



        return {
          totalServices,
          activeServices,
          inactiveServices: totalServices - activeServices,
          totalRevenue,
          avgPrice,
          
        };
      })
    );
  }


  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  }


  formatDuration(duration: number): string {
    if (duration < 60) {
      return `${duration} min`;
    } else if (duration < 1440) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else {
      const days = Math.floor(duration / 1440);
      const hours = Math.floor((duration % 1440) / 60);
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  }
} 