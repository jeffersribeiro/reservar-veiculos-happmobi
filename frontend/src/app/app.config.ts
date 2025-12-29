import { provideToastr } from 'ngx-toastr';

import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { httpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([httpErrorInterceptor, jwtInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3200,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      newestOnTop: true,
      tapToDismiss: true,
    }),
  ],
};
