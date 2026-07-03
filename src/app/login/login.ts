import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule, NzIconModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private msg: NzMessageService) { }
  loading = false;
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  submitForm(): void {
    if (this.validateForm.invalid) {
      // Mark all fields as dirty/touched if invalid
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.markAsTouched();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    this.loading = true;

    this.authService.loginUser(this.validateForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.msg.success('Login successful');
        this.cdr.detectChanges();
        this.validateForm.reset({
          remember: true
        });

        // Navigate to home page
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        const errorMessage = typeof err === 'string' ? err : 'Invalid Credentials. Please try again.';
        this.msg.error(errorMessage);
      }
    });
  }
}
