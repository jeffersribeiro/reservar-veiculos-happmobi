import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TokenService } from '../services/token.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.baseUrl;

  const url = req.url.startsWith('http') ? req.url : `${baseUrl}${req.url}`;

  const tokenStore = inject(TokenService);
  const token = tokenStore.getStoredToken();

  const routesToExclude = ['/auth/login', '/auth/signup'];

  const isAuthRoute = routesToExclude.some((e) => req.url.includes(e));

  const request = req.clone({
    url,
    setHeaders: {
      ...(token && !isAuthRoute ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(request);
};
