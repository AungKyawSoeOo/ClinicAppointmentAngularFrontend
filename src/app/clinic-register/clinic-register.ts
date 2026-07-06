import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink, Router } from '@angular/router';
import { NzUploadChangeParam, NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { strongPasswordValidator } from '../validators/password.validator';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../services/auth.service';
import { LocationService, City, Township } from '../services/location.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-clinic-register',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    RouterLink,
    NzUploadModule,
    NzSelectModule,
    NzAlertModule,
    CommonModule
  ],
  templateUrl: './clinic-register.html',
  styleUrl: './clinic-register.css',
})
export class ClinicRegister implements OnInit {
  fileList: NzUploadFile[] = [];
  constructor(private messageService: NzMessageService) {}
  loading = false;
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private locationService = inject(LocationService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  successMessage = '';
  errorMessage = '';

  cities: City[] = [];
  townships: Township[] = [];
  filteredTownships: Township[] = [];

  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, strongPasswordValidator()]),
    confirmPassword: this.fb.control('', [Validators.required]),
    liscensenum: this.fb.control('', [Validators.required]),
    phonenum: this.fb.control('', [Validators.required, Validators.pattern(/^(01|09)\d{7,9}$/)]),
    address: this.fb.control('', [Validators.required]),
    city_id: this.fb.control<number | null>(null, [Validators.required]),
    township_id: this.fb.control<number | null>(null, [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: any) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.locationService.getCities().subscribe({
      next: (res) => {
        if (res.result) {
          this.cities = res.data.filter(c => c.status === 'Active');
        }
      },
      error: (err) => console.error(err)
    });

    this.locationService.getTownships().subscribe({
      next: (res) => {
        if (res.result) {
          this.townships = res.data.filter(t => t.status === 'Active');
        }
      },
      error: (err) => console.error(err)
    });
  }

  onCityChange(cityId: number): void {
    this.validateForm.patchValue({ township_id: null });
    if (cityId) {
      this.filteredTownships = this.townships.filter(t => t.cityId === cityId);
    } else {
      this.filteredTownships = [];
    }
  }

   handleChange(info: NzUploadChangeParam): void {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);

    this.fileList = newFileList;

    if (info.file.status === 'done') {
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.log(`${info.file.name} file upload failed.`);
    }
  }

  submitForm(): void {
    if (this.validateForm.valid && !this.loading) {
      if (this.fileList.length === 0) {
        this.messageService.error('Please upload a license photo.');
        return;
      }

      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Prepare FormData for file upload
      const formData = new FormData();
      const formValue = this.validateForm.value;

      formData.append('username', formValue.username || '');
      formData.append('email', formValue.email || '');
      formData.append('password', formValue.password || '');
      formData.append('confirmPassword', formValue.confirmPassword || '');
      formData.append('liscensenum', formValue.liscensenum || '');
      formData.append('phonenum', formValue.phonenum || '');
      formData.append('address', formValue.address || '');
      if (formValue.city_id) formData.append('city_id', formValue.city_id.toString());
      if (formValue.township_id) formData.append('township_id', formValue.township_id.toString());

      if (this.fileList.length > 0) {
        // ng-zorro-antd NzUploadFile originFileObj contains the actual File
        const file = this.fileList[0].originFileObj as File;
        if (file) {
          formData.append('licensePhoto', file);
        }
      }

      this.authService.registerClinic(formData)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (res: any) => {
            this.successMessage = res.message;
            this.messageService.success(this.successMessage);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (err: any) => {
            this.errorMessage = err;
            this.messageService.error(this.errorMessage);
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      if (this.fileList.length === 0) {
        this.messageService.error('Please upload a license photo.');
      }
    }
  }
}
