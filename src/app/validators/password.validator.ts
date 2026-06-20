import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    const pattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    return pattern.test(value)
      ? null
      : { weakPassword: true };
  };
}