import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicDoctors } from './clinic-doctors';

describe('ClinicDoctors', () => {
  let component: ClinicDoctors;
  let fixture: ComponentFixture<ClinicDoctors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicDoctors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicDoctors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
