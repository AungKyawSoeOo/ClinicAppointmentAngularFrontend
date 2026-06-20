import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink } from '@angular/router';
import { NzUploadChangeParam, NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { strongPasswordValidator } from '../validators/password.validator';
import { NzSelectModule } from 'ng-zorro-antd/select';


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
    NzSelectModule
  ],
  templateUrl: './clinic-register.html',
  styleUrl: './clinic-register.css',
})
export class ClinicRegister {
  fileList: NzUploadFile[] = [];
  constructor(private messageService: NzMessageService) {}
  loading = false;
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, strongPasswordValidator()]),
    confirmPassword: this.fb.control('', [Validators.required]),
    liscensenum: this.fb.control('', [Validators.required]),
    phonenum: this.fb.control('', [Validators.required, Validators.pattern(/^(01|09)\d{7,9}$/)]),
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
    console.log('register');
  }
}
