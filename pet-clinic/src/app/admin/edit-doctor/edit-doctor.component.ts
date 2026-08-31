import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor, UpdateDoctorRequest } from '../../models/doctor.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss']
})
export class EditDoctorComponent implements OnInit {
  doctor: Doctor | null = null;
  isLoading = false;
  isUpdating = false;
  doctorId: number = 0;
  specializations: string[] = [];

  editForm: UpdateDoctorRequest = {
    id: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = +params['id'];
      if (this.doctorId) {
        this.loadDoctor();
        this.loadSpecializations();
      }
    });
  }

  loadDoctor(): void {
    this.isLoading = true;
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.editForm = {
          id: doctor.id || 0,
          dname: doctor.dname,
          demail: doctor.demail,
          dtp: doctor.dtp,
          specialization: doctor.specialization,
          experience: doctor.experience,
          education: doctor.education,
          available: doctor.available
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctor:', error);
        this.toastr.error('Failed to load doctor details');
        this.isLoading = false;
      }
    });
  }

  loadSpecializations(): void {
    this.specializations = this.doctorService.getSpecializations();
  }

  updateDoctor(): void {
    if (this.isUpdating || !this.editForm.id) return;
    
    this.isUpdating = true;
    this.doctorService.updateDoctor(this.editForm.id, this.editForm).subscribe({
      next: (response) => {
        this.toastr.success('Doctor updated successfully!', 'Success');
        this.router.navigate(['/admin/doctors']);
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating doctor:', error);
        this.toastr.error('Failed to update doctor', 'Error');
        this.isUpdating = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/doctors']);
  }
} 