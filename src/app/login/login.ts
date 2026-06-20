import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule, NzIconModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
isLoggedIn = false;
userName = 'Patient';

logout() {
  this.isLoggedIn = false;
  console.log('Logged out');
}
  constructor(private msg: NzMessageService) { }
  loading = false;
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.loading = true;

      console.log('submit', this.validateForm.value);

      setTimeout(() => {
        this.loading = false;
        this.msg.success('Login successful');

        this.validateForm.reset({
          email: '',
          password: '',
          remember: true
        });
      }, 1000);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.markAsTouched();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }
}
