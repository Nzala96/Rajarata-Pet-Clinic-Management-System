import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardService, CreateAppointmentRequest, Doctor } from '../../services/admin-dashboard.service';
import { DoctorService } from '../../services/doctor.service';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { Doctor as DoctorModel } from '../../models/doctor.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent implements OnInit {
  doctors: Doctor[] = [];
  services: Service[] = [];
  isCreating = false;
  
  // Form data
  appointmentForm: CreateAppointmentRequest = {
    date: '',
    time: '',
    petname: '',
    docname: '',
    name: '',
    email: '',
    contactNumber: '',
    appointmentType: '',
    notes: '',
    petAge: '',
    petBreed: '',
    reasonForVisit: ''
  };

  constructor(
    private adminService: AdminDashboardService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadServices();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (doctorModels: DoctorModel[]) => {
        // Map the doctor models to the admin dashboard service Doctor interface
        this.doctors = doctorModels.map(doctor => ({
          id: doctor.id || 0,
          name: doctor.dname,
          specialization: doctor.specialization,
          email: doctor.demail,
          phone: doctor.dtp,
          available: doctor.available
        }));
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.toastr.error('Failed to load doctors', 'Error');
      }
    });
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.toastr.error('Failed to load services', 'Error');
      }
    });
  }

  createAppointment(): void {
    if (!this.validateAppointmentForm()) {
      return;
    }

    this.isCreating = true;
    this.adminService.createAppointment(this.appointmentForm).subscribe({
      next: (response) => {
        this.toastr.success('Appointment created successfully', 'Success');
        this.router.navigate(['/admin/appointments']);
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        this.toastr.error('Failed to create appointment', 'Error');
        this.isCreating = false;
      }
    });
  }

  validateAppointmentForm(): boolean {
    if (!this.appointmentForm.date) {
      this.toastr.error('Date is required', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.time) {
      this.toastr.error('Time is required', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.petname) {
      this.toastr.error('Pet name is required', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.name) {
      this.toastr.error('Owner name is required', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.email) {
      this.toastr.error('Email is required', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.contactNumber) {
      this.toastr.error('Contact number is required', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.docname) {
      this.toastr.error('Doctor is required', 'Validation Error');
      return false;
    }
    if (!this.appointmentForm.appointmentType) {
      this.toastr.error('Appointment type is required', 'Validation Error');
      return false;
    }
    return true;
  }

  onCancel(): void {
    this.router.navigate(['/admin/appointments']);
  }
}
