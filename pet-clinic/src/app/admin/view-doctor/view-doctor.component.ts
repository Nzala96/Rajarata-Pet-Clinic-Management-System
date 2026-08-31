import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrls: ['./view-doctor.component.scss']
})
export class ViewDoctorComponent implements OnInit {
  doctor: Doctor | null = null;
  isLoading = false;
  doctorId: number = 0;

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
      }
    });
  }

  loadDoctor(): void {
    this.isLoading = true;
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctor:', error);
        this.toastr.error('Failed to load doctor details');
        this.isLoading = false;
      }
    });
  }

  getStatusBadgeClass(available: boolean | undefined): string {
    return available ? 'badge bg-success' : 'badge bg-danger';
  }

  getStatusText(available: boolean | undefined): string {
    return available ? 'Available' : 'Unavailable';
  }

  editDoctor(): void {
    if (this.doctor) {
      this.router.navigate(['/admin/doctors/edit', this.doctor.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/doctors']);
  }
} 