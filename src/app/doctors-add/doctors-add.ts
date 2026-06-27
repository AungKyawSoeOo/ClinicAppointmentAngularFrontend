import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-doctors-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzTagModule,
    NzAvatarModule,
    NzDividerModule,
    NzTypographyModule
  ],
  templateUrl: './doctors-add.html',
  styleUrl: './doctors-add.css',
})
export class DoctorsAdd implements OnInit {
  doctorForm!: FormGroup;
  loading = false;

  specializationOptions = [
    'General Practitioner',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Orthopedic Surgeon',
    'Ophthalmologist',
    'Psychiatrist',
    'Gastroenterologist',
    'Gynecologist'
  ];

  daysOfWeek = [
    { label: 'Monday', value: 1, shortLabel: 'Mon' },
    { label: 'Tuesday', value: 2, shortLabel: 'Tue' },
    { label: 'Wednesday', value: 3, shortLabel: 'Wed' },
    { label: 'Thursday', value: 4, shortLabel: 'Thu' },
    { label: 'Friday', value: 5, shortLabel: 'Fri' },
    { label: 'Saturday', value: 6, shortLabel: 'Sat' },
    { label: 'Sunday', value: 7, shortLabel: 'Sun' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      doctor_name: ['', [Validators.required, Validators.maxLength(100)]],
      doctor_license_no: ['', [Validators.required, Validators.maxLength(100)]],
      specialization: ['', [Validators.required]],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(60)]],
      phone: ['', [Validators.required, Validators.pattern(/^(01|09|\+959)\d{7,10}$/)]],
      consultation_duration: [15, [Validators.required, Validators.min(5), Validators.max(120)]],
      max_capacity_per_slot: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      working_days: [[], [Validators.required]],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]]
    });
  }

  // Live Avatar Seed calculation based on Doctor Name
  getAvatarUrl(): string {
    const name = this.doctorForm?.get('doctor_name')?.value || 'Doctor';
    const seed = encodeURIComponent(name.trim().toLowerCase());
    return `https://api.dicebear.com/7.x/miniavs/svg?seed=${seed}`;
  }

  getSelectedDaysShortLabels(): string[] {
    const selectedValues: number[] = this.doctorForm?.get('working_days')?.value || [];
    return this.daysOfWeek
      .filter(day => selectedValues.includes(day.value))
      .map(day => day.shortLabel);
  }

  submitForm(): void {
    if (this.doctorForm.valid) {
      this.loading = true;
      console.log('Submitting Doctor Form Data:', this.doctorForm.value);

      setTimeout(() => {
        this.loading = false;
        this.message.success('Doctor added successfully!');

        // Navigate to the clinic doctor list page
        this.router.navigate(['/clinic/1/doctors-list']);

        this.doctorForm.reset({
          doctor_name: '',
          doctor_license_no: '',
          specialization: '',
          experience: '',
          phone: '',
          consultation_duration: 15,
          max_capacity_per_slot: 1,
          working_days: [],
          start_time: null,
          end_time: null
        });
      }, 1000);
    } else {
      Object.values(this.doctorForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('Please fill in all required fields correctly.');
    }
  }
}
