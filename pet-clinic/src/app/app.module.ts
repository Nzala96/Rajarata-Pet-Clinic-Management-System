import { Component, NgModule } from '@angular/core';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AboutComponent } from './components/about/about.component';
import { AppointmentComponent } from './components/appointment/appointment.component';

import { DoctorsComponent } from './components/doctors/doctors.component';
import { OurservComponent } from './components/ourserv/ourserv.component';
import { ContactComponent } from './components/contact/contact.component';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UpdateAppointmentComponent } from './components/update-appointment/update-appointment.component';
import { CreateDoctorComponent } from './components/create-doctor/create-doctor.component';
import { UpdateDoctorComponent } from './components/update-doctor/update-doctor.component';
import { ViewAppointmentComponent } from './components/view-appointment/view-appointment.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { AdminViewAppointmentComponent } from './admin/appointment-management/admin-view-appointment/admin-view-appointment.component';
import { AdminAppointmentsComponent } from './admin/admin-appointments/admin-appointments.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { ClientSidebarComponent } from './components/client-sidebar/client-sidebar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    HeroSectionComponent,
    AboutComponent,
    AppointmentComponent,
    DoctorsComponent,
    OurservComponent,
    ContactComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    UpdateAppointmentComponent,
    CreateDoctorComponent,
    UpdateDoctorComponent,
    ViewAppointmentComponent,
    ViewUsersComponent,
    AdminViewAppointmentComponent,
    AdminAppointmentsComponent,
    ProfileComponent,
    AdminSidebarComponent,
    ClientSidebarComponent,
    UserProfileComponent,
    InvoicePaymentComponent,
    ClientLayoutComponent,
    AuthLayoutComponent,
    AdminPetsComponent,
    PetDetailsComponent,
    MedicalDocumentsComponent,
    AdminClientsComponent,
    ClientDetailsComponent,
    DoctorManagementComponent,
    ServiceManagementComponent,
    BillingManagementComponent,
    ReportsManagementComponent,
    UserAppointmentsComponent,
    FaqComponent,
    AddAppointmentComponent,
    AddDoctorComponent,
    AddServiceComponent,
    AddInvoiceComponent,
    AddUserAppointmentComponent,
    EditUserAppointmentComponent,
    AddPetComponent,
    ViewInvoiceComponent,
    EditInvoiceComponent,
    EditAppointmentComponent,
    EditPetComponent,
    ViewDoctorComponent,
    EditDoctorComponent,
    ViewServiceComponent,
    EditServiceComponent,
    DiseaseDiagnosisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    provideHttpClient(withFetch()),
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

