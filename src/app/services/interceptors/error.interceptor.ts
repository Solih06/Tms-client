import { HttpErrorResponse } from '@angular/common/http';
import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Safely extract the server's ProblemDetails.detail message
      const message = err.error?.detail || err.error?.title || 'A system error occurred.';

      if (err.status === 401) {
        router.navigate(['/login']);
      } else {
        console.error(message);
      }

      return throwError(() => err);
    })
  );
};