import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { CreateDoctorRequest } from '../../models/doctor.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent implements OnInit {
  specializations: string[] = [
    'General Veterinarian',
    'Emergency and Critical Care',
    'Internal Medicine',
    'Surgery',
    'Dermatology',
    'Cardiology',
    'Oncology',
    'Orthopedics',
    'Ophthalmology',
    'Dentistry',
    'Exotic Animal Medicine',
    'Behavior',
    'Radiology',
    'Pathology',
    'Anesthesiology'
  ];
  
  isCreating = false;
  
  // Form data
  createForm: CreateDoctorRequest = {
    dname: '',
    demail: '',
    dtp: '',
    specialization: '',
    experience: 0,
    education: '',
    available: true
  };

  constructor(
    private doctorService: DoctorService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createDoctor(): void {
    if (this.isCreating) return;
    
    this.isCreating = true;
    this.doctorService.createDoctor(this.createForm).subscribe({
      next: (response) => {
        this.toastr.success('Doctor created successfully!', 'Success');
        this.router.navigate(['/admin/doctors']);
      },
      error: (error) => {
        console.error('Error creating doctor:', error);
        this.toastr.error('Failed to create doctor', 'Error');
        this.isCreating = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/doctors']);
  }
}
