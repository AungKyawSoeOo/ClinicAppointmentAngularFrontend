import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAppointment } from './doctors-appointment';

describe('DoctorsAppointment', () => {
  let component: DoctorsAppointment;
  let fixture: ComponentFixture<DoctorsAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsAppointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
