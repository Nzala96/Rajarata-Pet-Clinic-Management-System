import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserAppointmentComponent } from './add-user-appointment.component';

describe('AddUserAppointmentComponent', () => {
  let component: AddUserAppointmentComponent;
  let fixture: ComponentFixture<AddUserAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserAppointmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUserAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
