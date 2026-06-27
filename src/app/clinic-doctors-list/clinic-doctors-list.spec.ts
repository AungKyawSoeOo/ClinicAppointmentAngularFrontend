import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicDoctorsList } from './clinic-doctors-list';
import { provideRouter } from '@angular/router';

describe('ClinicDoctorsList', () => {
  let component: ClinicDoctorsList;
  let fixture: ComponentFixture<ClinicDoctorsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicDoctorsList],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicDoctorsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
