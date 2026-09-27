import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RoleType } from '../../shared/models/user.model';

export const RoleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as RoleType;

  const userRole = authService.currentRole();
  if (userRole === 'SUPER_ADMIN' || userRole === requiredRole) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
