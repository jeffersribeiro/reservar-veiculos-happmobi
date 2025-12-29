import { catchError, throwError } from 'rxjs';

import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { ToastService } from '../services/toast.service';
import { ApiErrorService } from '../services/api-error.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const apiError = inject(ApiErrorService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      const msg = apiError.toMessage(err);

      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }

      toast.error(msg);

      return throwError(() => err);
    })
  );
};
