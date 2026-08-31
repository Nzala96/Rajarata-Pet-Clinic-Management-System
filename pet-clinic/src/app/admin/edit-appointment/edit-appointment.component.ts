import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminDashboardService, AdminAppointment, UpdateAppointmentRequest } from '../../services/admin-dashboard.service';
import { DoctorService } from '../../services/doctor.service';
import { ServiceService } from '../../services/service.service';
import { ToastrService } from 'ngx-toastr';
import { Doctor } from '../../models/doctor.model';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss']
})
export class EditAppointmentComponent implements OnInit {
  appointment: AdminAppointment | null = null;
  isLoading = false;
  isUpdating = false;
  
  // Dropdown data
  doctors: Doctor[] = [];
  services: Service[] = [];
  
  // Form options
  statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];
  
  // Edit form data
  editForm: UpdateAppointmentRequest = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminDashboardService,
    private doctorService: DoctorService,
    private serviceService: ServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAppointment();
    this.loadDropdownData();
  }

  loadAppointment(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastr.error('Invalid appointment ID');
      this.router.navigate(['/admin/appointments']);
      return;
    }

    this.isLoading = true;
    this.adminService.getAllAppointments({}).subscribe({
      next: (response: any) => {
        console.log('Appointments response:', response);
        const appointments = response.data || response;
        this.appointment = appointments.find((apt: AdminAppointment) => apt.id === parseInt(id));
        
        if (this.appointment) {
          // Check if appointment can be edited
          if (!this.canEditAppointment(this.appointment)) {
            this.toastr.error(`Cannot edit ${this.appointment.status} appointments`, 'Error');
            this.router.navigate(['/admin/appointments']);
            return;
          }
          this.populateForm();
        } else {
          this.toastr.error('Appointment not found');
          this.router.navigate(['/admin/appointments']);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading appointment:', error);
        this.toastr.error('Failed to load appointment');
        this.isLoading = false;
      }
    });
  }

  populateForm(): void {
    if (!this.appointment) return;

    this.editForm = {
      date: this.appointment.date,
      time: this.appointment.time,
      petname: this.appointment.petname,
      docname: this.appointment.docname,
      name: this.appointment.name,
      email: this.appointment.email,
      contactNumber: this.appointment.contactNumber,
      appointmentType: this.appointment.appointmentType,
      notes: this.appointment.notes,
      status: this.appointment.status,
      petAge: this.appointment.petAge,
      petBreed: this.appointment.petBreed,
      reasonForVisit: this.appointment.reasonForVisit
    };
  }

  loadDropdownData(): void {
    this.loadDoctors();
    this.loadServices();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (response: any) => {
        console.log('Doctors response:', response);
        this.doctors = response || [];
      },
      error: (error: any) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        console.log('Services response:', response);
        this.services = response || [];
      },
      error: (error: any) => {
        console.error('Error loading services:', error);
      }
    });
  }

  onDoctorSelected(event: any): void {
    this.editForm.docname = event.target.value;
  }

  onServiceSelected(event: any): void {
    this.editForm.appointmentType = event.target.value;
  }

  updateAppointment(): void {
    if (!this.appointment) return;

    this.isUpdating = true;
    this.adminService.updateAppointment(this.appointment.id, this.editForm).subscribe({
      next: (response) => {
        if (response.success !== false) {
          this.toastr.success('Appointment updated successfully', 'Success');
          this.router.navigate(['/admin/appointments']);
        } else {
          this.toastr.error(response.message || 'Failed to update appointment', 'Error');
        }
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
        this.toastr.error('Failed to update appointment', 'Error');
        this.isUpdating = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/appointments']);
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'badge bg-success';
      case 'completed': return 'badge bg-primary';
      case 'cancelled': return 'badge bg-danger';
      case 'pending': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  public canEditAppointment(appointment: AdminAppointment): boolean {
    return appointment.status === 'pending';
  }
}
