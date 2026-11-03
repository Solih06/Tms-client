import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service.js';

export const instructorGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Check if user has Instructor or Admin role
  if (auth.hasRole('Instructor') || auth.hasRole('Admin')) {
    return true;
  }

  // Block route navigation instantly and redirect to /unauthorized
  return router.createUrlTree(['/unauthorized']);
};