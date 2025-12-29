import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AppShellLayoutComponent } from './shared/components/shell-layout/app-shell-layout.component';
import { authGuard } from './shared/guards/auth.guard';
import { VehicleDetailScreenComponent } from './pages/vehicle-detail/vehicle-detail-screen.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: AppShellLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },

      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home-screen.component').then(
            (m) => m.HomeScreenComponent
          ),
      },
      // {
      //   path: 'bookings',
      //   loadComponent: () =>
      //     import('./pages/bookings/bookings-screen.component').then(
      //       (m) => m.BookingsScreenComponent
      //     ),
      // },
      {
        path: 'central',
        loadComponent: () =>
          import('./pages/help/help-screen.component').then(
            (m) => m.HelpScreenComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile-screen.component').then(
            (m) => m.ProfileScreenComponent
          ),
      },
    ],
  },

  {
    path: 'filter',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/filter/filter-screen.component').then(
        (m) => m.FilterScreenComponent
      ),
  },
  {
    path: 'vehicles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/list-vehicles/list-vehicles-screen.component').then(
        (m) => m.ListVehiclesScreenComponent
      ),
  },
  {
    path: 'vehicles/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vehicle-detail/vehicle-detail-screen.component').then(
        (m) => m.VehicleDetailScreenComponent
      ),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
