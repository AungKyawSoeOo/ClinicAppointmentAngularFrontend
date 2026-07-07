import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
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
  clinicId: string | null = null;

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
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('clinicId');
    if (!this.clinicId) {
      const user = this.authService.currentUser();
      if (user && user.clinicId) {
        this.clinicId = user.clinicId.toString();
      }
    }

    this.doctorForm = this.fb.group({
      doctor_name: ['', [Validators.required, Validators.maxLength(100)]],
      doctor_license_no: ['', [Validators.required, Validators.maxLength(100)]],
      specialization: ['', [Validators.required]],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(60)]],
      phone: ['', [Validators.required, Validators.pattern(/^(01|09|\+959)\d{7,10}$/)]],
      consultation_duration: [15, [Validators.required, Validators.min(5), Validators.max(120)]],
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
      const formData = {
        clinic_id: this.clinicId ? parseInt(this.clinicId, 10) : null,
        ...this.doctorForm.value,
        start_time: this.doctorForm.value.start_time ? this.formatTime(this.doctorForm.value.start_time) : null,
        end_time: this.doctorForm.value.end_time ? this.formatTime(this.doctorForm.value.end_time) : null,
      };

      this.http.post('http://localhost:3000/api/doctors', formData).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.result) {
            this.message.success('Doctor added successfully! Timeslots generated.');
            this.router.navigate([`/clinic/${this.clinicId}/doctors-list`]);
            this.doctorForm.reset({
              doctor_name: '',
              doctor_license_no: '',
              specialization: '',
              experience: '',
              phone: '',
              consultation_duration: 15,
              working_days: [],
              start_time: null,
              end_time: null
            });
          } else {
            this.message.error(res.message || 'Failed to add doctor');
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error adding doctor:', err);
          this.message.error('An error occurred while adding the doctor');
        }
      });
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

  formatTime(dateObj: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`;
  }
}
