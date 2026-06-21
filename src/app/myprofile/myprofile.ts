import { Component, OnInit } from '@angular/core';
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

  // Mock patient data based on DB schema
  patientData = {
    patient_id: 1,
    user_id: 101,
    email: 'patient@example.com',
    full_name: 'John Doe',
    phone: '+95912345678',
    gender: 'Male',
    dob: new Date('1990-05-15'),
    status: 'Active',
    created_at: new Date('2025-01-01T10:00:00Z')
  };

  constructor(private fb: FormBuilder, private message: NzMessageService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      full_name: [{ value: this.patientData.full_name, disabled: true }, [Validators.required]],
      phone: [{ value: this.patientData.phone, disabled: true }, [Validators.required]],
      gender: [{ value: this.patientData.gender, disabled: true }, [Validators.required]],
      dob: [{ value: this.patientData.dob, disabled: true }, [Validators.required]],
      email: [{ value: this.patientData.email, disabled: true }] // Usually read-only
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
        full_name: this.patientData.full_name,
        phone: this.patientData.phone,
        gender: this.patientData.gender,
        dob: this.patientData.dob
      });
      this.profileForm.get('full_name')?.disable();
      this.profileForm.get('phone')?.disable();
      this.profileForm.get('gender')?.disable();
      this.profileForm.get('dob')?.disable();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      // In a real app, an API call here
      const updatedValues = this.profileForm.getRawValue();
      this.patientData.full_name = updatedValues.full_name;
      this.patientData.phone = updatedValues.phone;
      this.patientData.gender = updatedValues.gender;
      this.patientData.dob = updatedValues.dob;
      this.message.success('Profile updated successfully!');

      this.isEditMode = false;
      this.profileForm.get('full_name')?.disable();
      this.profileForm.get('phone')?.disable();
      this.profileForm.get('gender')?.disable();
      this.profileForm.get('dob')?.disable();
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
