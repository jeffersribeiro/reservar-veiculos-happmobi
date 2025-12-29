import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const tokenStore = inject(TokenService);
  const router = inject(Router);

  const token = tokenStore.getStoredToken();

  if (token) return true;

  return router.createUrlTree(['/login']);
};
