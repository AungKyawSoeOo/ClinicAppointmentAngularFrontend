import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicRegister } from './clinic-register';

describe('ClinicRegister', () => {
  let component: ClinicRegister;
  let fixture: ComponentFixture<ClinicRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
