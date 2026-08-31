import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { HeaderComponent } from './components/header/header.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { OurservComponent } from './components/ourserv/ourserv.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { UpdateAppointmentComponent } from './components/update-appointment/update-appointment.component';
import { CreateDoctorComponent } from './components/create-doctor/create-doctor.component';
import { UpdateDoctorComponent } from './components/update-doctor/update-doctor.component';
import { ViewAppointmentComponent } from './components/view-appointment/view-appointment.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { AdminViewAppointmentComponent } from './admin/appointment-management/admin-view-appointment/admin-view-appointment.component';
import { AdminAppointmentsComponent } from './admin/admin-appointments/admin-appointments.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { InvoicePaymentComponent } from './components/invoice-payment/invoice-payment.component';
import { ClientLayoutComponent } from './components/client-layout/client-layout.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { AdminPetsComponent } from './admin/admin-pets/admin-pets.component';
import { PetDetailsComponent } from './admin/pet-details/pet-details.component';
import { MedicalDocumentsComponent } from './admin/medical-documents/medical-documents.component';
import { AdminClientsComponent } from './admin/admin-clients/admin-clients.component';
import { ClientDetailsComponent } from './admin/client-details/client-details.component';
import { DoctorManagementComponent } from './admin/doctor-management/doctor-management.component';
import { ServiceManagementComponent } from './admin/service-management/service-management.component';
import { BillingManagementComponent } from './admin/billing-management/billing-management.component';
import { ReportsManagementComponent } from './admin/reports-management/reports-management.component';
import { UserAppointmentsComponent } from './components/user-appointments/user-appointments.component';
import { FaqComponent } from './components/faq/faq.component';
import { AddAppointmentComponent } from './admin/add-appointment/add-appointment.component';
import { AddDoctorComponent } from './admin/add-doctor/add-doctor.component';
import { AddServiceComponent } from './admin/add-service/add-service.component';
import { AddInvoiceComponent } from './admin/add-invoice/add-invoice.component';
import { AddUserAppointmentComponent } from './components/add-user-appointment/add-user-appointment.component';
import { EditUserAppointmentComponent } from './components/edit-user-appointment/edit-user-appointment.component';
import { AddPetComponent } from './components/add-pet/add-pet.component';
import { ViewInvoiceComponent } from './admin/view-invoice/view-invoice.component';
import { EditInvoiceComponent } from './admin/edit-invoice/edit-invoice.component';
import { EditAppointmentComponent } from './admin/edit-appointment/edit-appointment.component';
import { EditPetComponent } from './admin/edit-pet/edit-pet.component';
import { ViewDoctorComponent } from './admin/view-doctor/view-doctor.component';
import { EditDoctorComponent } from './admin/edit-doctor/edit-doctor.component';
import { ViewServiceComponent } from './admin/view-service/view-service.component';
import { EditServiceComponent } from './admin/edit-service/edit-service.component';
import { DiseaseDiagnosisComponent } from './components/disease-diagnosis/disease-diagnosis.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

const routes: Routes = [
  // Public routes (no layout)
  { path: '', component: HomeComponent },
  { path: 'about', component: HomeComponent, data: { fragment: 'about' } },
  { path: 'services', component: HomeComponent, data: { fragment: 'services' } },
  { path: 'doctors', component: HomeComponent, data: { fragment: 'doctors' } },
  { path: 'public-faq', component: FaqComponent },
  { path: 'disease-diagnosis', component: DiseaseDiagnosisComponent },
  
  
  // Auth routes (login/signup)
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },

  // Authenticated routes with client layout
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent }, // Legacy dashboard - will redirect based on role
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'user-dashboard', component: UserDashboardComponent },
      { path: 'appointment', component: AppointmentComponent },
      { path: 'my-appointments', component: UserAppointmentsComponent },
      { path: 'my-appointments/add', component: AddUserAppointmentComponent },
      { path: 'my-appointments/edit/:id', component: EditUserAppointmentComponent },
      { path: 'update-appointment', component: UpdateAppointmentComponent },
      { path: 'view-appointment', component: ViewAppointmentComponent },
      { path: 'create-doctor', component: CreateDoctorComponent },
      { path: 'update-doctor', component: UpdateDoctorComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'payments', component: InvoicePaymentComponent },
      { path: 'view-users', component: ViewUsersComponent },
      { path: 'contact', component: ContactComponent, data: { fragment: 'contact' } },
      { path: 'faq', component: FaqComponent },
      { path: 'pets/add', component: AddPetComponent },
      { path: 'pets/edit/:id', component: EditPetComponent },
      { path: 'disease-checker', component: DiseaseDiagnosisComponent },
      
      // Admin Appointment Management
      { path: 'admin/appointment-management/view', component: AdminViewAppointmentComponent },
      { path: 'admin/appointments', component: AdminAppointmentsComponent },
      { path: 'admin/appointments/manage', component: AdminAppointmentsComponent },
      { path: 'admin/appointments/view-all', component: AdminAppointmentsComponent },
      { path: 'admin/appointments/add', component: AddAppointmentComponent },
      { path: 'admin/appointments/edit/:id', component: EditAppointmentComponent },
      
      // Admin Pet Management
      { path: 'admin/pets', component: AdminPetsComponent },
      { path: 'admin/pets/all', component: AdminPetsComponent },
      { path: 'admin/pets/add', component: AdminPetsComponent },
      { path: 'admin/pets/details/:id', component: PetDetailsComponent },
      { path: 'admin/pets/edit/:id', component: EditPetComponent },
      { path: 'admin/pets/medical-history/:id', component: PetDetailsComponent },
      { path: 'admin/pets/vaccinations/:id', component: PetDetailsComponent },
      { path: 'admin/pets/documents/:id', component: MedicalDocumentsComponent },
      { path: 'admin/pets/add-medical-record/:id', component: PetDetailsComponent },
      { path: 'admin/pets/add-vaccination/:id', component: PetDetailsComponent },
      { path: 'admin/pets/upload-document/:id', component: MedicalDocumentsComponent },
      { path: 'admin/pets/link-owner/:id', component: AdminPetsComponent },
      { path: 'admin/pets/statistics', component: AdminPetsComponent },
      
      // Admin Client Management
      { path: 'admin/clients', component: AdminClientsComponent },
      { path: 'admin/clients/all', component: AdminClientsComponent },
      { path: 'admin/clients/details/:id', component: ClientDetailsComponent },
      { path: 'admin/clients/edit/:id', component: AdminClientsComponent },
      { path: 'admin/clients/pets/:id', component: ClientDetailsComponent },
      { path: 'admin/clients/visit-history/:id', component: ClientDetailsComponent },
      { path: 'admin/clients/contact-info/:id', component: ClientDetailsComponent },
      { path: 'admin/clients/add-contact/:id', component: ClientDetailsComponent },
      { path: 'admin/clients/link-pet/:id', component: ClientDetailsComponent },
      { path: 'admin/clients/statistics', component: AdminClientsComponent },
      { path: 'admin/clients/export', component: AdminClientsComponent },
      
      // Admin Doctor Management
      { path: 'admin/doctors', component: DoctorManagementComponent },
      { path: 'admin/doctors/manage', component: DoctorManagementComponent },
      { path: 'admin/doctors/all', component: DoctorManagementComponent },
      { path: 'admin/doctors/add', component: AddDoctorComponent },
      { path: 'admin/doctors/view/:id', component: ViewDoctorComponent },
      { path: 'admin/doctors/edit/:id', component: EditDoctorComponent },
      
      // Admin Service Management
      { path: 'admin/services', component: ServiceManagementComponent },
      { path: 'admin/services/manage', component: ServiceManagementComponent },
      { path: 'admin/services/all', component: ServiceManagementComponent },
      { path: 'admin/services/add', component: AddServiceComponent },
      { path: 'admin/services/view/:id', component: ViewServiceComponent },
      { path: 'admin/services/edit/:id', component: EditServiceComponent },
      { path: 'admin/services/pricing', component: ServiceManagementComponent },
      
      // Admin Billing Management
      { path: 'admin/billing', component: BillingManagementComponent },
      { path: 'admin/billing/manage', component: BillingManagementComponent },
      { path: 'admin/billing/create', component: AddInvoiceComponent },
      { path: 'admin/billing/view/:id', component: ViewInvoiceComponent },
      { path: 'admin/billing/edit/:id', component: EditInvoiceComponent },
      { path: 'admin/billing/payments', component: BillingManagementComponent },
      { path: 'admin/billing/reports', component: BillingManagementComponent },
      
      // Admin Reports Management
      { path: 'admin/reports', component: ReportsManagementComponent },
      { path: 'admin/reports/dashboard', component: ReportsManagementComponent },
      { path: 'admin/reports/appointments', component: ReportsManagementComponent },
      { path: 'admin/reports/clients', component: ReportsManagementComponent },
      { path: 'admin/reports/earnings', component: ReportsManagementComponent },
      
      // Additional Admin Routes
      { path: 'admin/dashboard', component: DashboardComponent },
      { path: 'admin/reports', component: DashboardComponent },
      { path: 'admin/settings', component: DashboardComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
