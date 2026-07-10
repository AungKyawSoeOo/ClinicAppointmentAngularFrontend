import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const clinicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.currentUser()?.role === 'clinic') {
    return true;
  }

  // Redirect to login if not logged in, or home page if logged in but not clinic
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  return router.createUrlTree(['/']);
};
