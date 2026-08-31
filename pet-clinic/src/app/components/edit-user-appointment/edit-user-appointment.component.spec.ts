import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserAppointmentComponent } from './edit-user-appointment.component';

describe('EditUserAppointmentComponent', () => {
  let component: EditUserAppointmentComponent;
  let fixture: ComponentFixture<EditUserAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUserAppointmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditUserAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
