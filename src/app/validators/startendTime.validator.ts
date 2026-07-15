import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('start_time')?.value;
  const end = control.get('end_time')?.value;

  if (start && end && start >= end) {
    return { timeMismatch: true };
  }
  return null;
};