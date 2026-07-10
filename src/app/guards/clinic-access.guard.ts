import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const clinicAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const targetClinicId = route.paramMap.get('clinicId');
  const userClinicId = authService.getAuthorizedClinicId();

  if (targetClinicId === userClinicId?.toString()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};