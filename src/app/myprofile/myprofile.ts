import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-myprofile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCardModule,
    NzTypographyModule,
    NzDividerModule,
    NzTagModule
  ],
  templateUrl: './myprofile.html',
  styleUrl: './myprofile.css',
})
export class Myprofile implements OnInit {
  profileForm!: FormGroup;
  isEditMode = false;
  loading = false;

  disabledDate = (current: Date): boolean => {
    if (!current) {
      return false;
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return current.getTime() > today.getTime();
  };

  // Active session and profile data
  userId: number | null = null;
  patientData: any = {
    patient_id: 0,
    user_id: 0,
    email: '',
    full_name: '',
    phone: '',
    gender: '',
    dob: null,
    status: 'Active',
    created_at: new Date()
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder, private message: NzMessageService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.message.error('Please log in to view your profile.');
      this.router.navigate(['/login']);
      return;
    }

    this.userId = user.userId;

    this.profileForm = this.fb.group({
      full_name: [{ value: '', disabled: true }, [Validators.required]],
      phone: [{ value: '', disabled: true }, [Validators.required]],
      gender: [{ value: '', disabled: true }, [Validators.required]],
      dob: [{ value: null, disabled: true }, [Validators.required]],
      email: [{ value: user.email || '', disabled: true }] // Read-only
    });

    this.fetchProfile();
  }

  fetchProfile(): void {
    if (!this.userId) return;
    this.loading = true;
    this.authService.getProfile(this.userId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.result && response.data) {
          this.patientData = response.data;

          this.profileForm.patchValue({
            full_name: this.patientData.full_name || '',
            phone: this.patientData.phone || '',
            gender: this.patientData.gender || '',
            dob: this.patientData.dob ? new Date(this.patientData.dob) : null,
            email: this.patientData.email || ''
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.message.error(typeof err === 'string' ? err : 'Error loading profile data');
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.profileForm.get('full_name')?.enable();
      this.profileForm.get('phone')?.enable();
      this.profileForm.get('gender')?.enable();
      this.profileForm.get('dob')?.enable();
    } else {
      // Cancel edit: reset to original values and disable
      this.profileForm.patchValue({
        full_name: this.patientData.full_name || '',
        phone: this.patientData.phone || '',
        gender: this.patientData.gender || '',
        dob: this.patientData.dob ? new Date(this.patientData.dob) : null
      });
      this.profileForm.get('full_name')?.disable();
      this.profileForm.get('phone')?.disable();
      this.profileForm.get('gender')?.disable();
      this.profileForm.get('dob')?.disable();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.userId) {
      this.loading = true;
      const updatedValues = this.profileForm.getRawValue();

      this.authService.updateProfile(this.userId, updatedValues).subscribe({
        next: (response) => {
          this.loading = false;
          if (response && response.result) {
            // Update local memory
            this.patientData.full_name = updatedValues.full_name;
            this.patientData.phone = updatedValues.phone;
            this.patientData.gender = updatedValues.gender;
            this.patientData.dob = updatedValues.dob;

            // Sync user name with header session Signal
            this.authService.updateCurrentUserName(updatedValues.full_name);

            this.message.success('Profile updated successfully!');
            this.isEditMode = false;
            this.profileForm.get('full_name')?.disable();
            this.profileForm.get('phone')?.disable();
            this.profileForm.get('gender')?.disable();
            this.profileForm.get('dob')?.disable();
          }
        },
        error: (err) => {
          this.loading = false;
          this.message.error(typeof err === 'string' ? err : 'Error saving profile data');
        }
      });
    } else {
      Object.values(this.profileForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
