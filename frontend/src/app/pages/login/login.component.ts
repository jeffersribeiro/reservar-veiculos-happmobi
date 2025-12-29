import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { PillInputComponent } from '../../shared/components/pill-input/pill-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LinkButtonComponent } from '../../shared/components/link-button/link-button.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PillInputComponent,
    ButtonComponent,
    LinkButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  readonly form: FormGroup;
  isSubmitting = false;

  constructor(
    private toast: ToastService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { email, password } = this.form.getRawValue();

    this.authService
      .login(email, password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }

  forgotPassword(): void {
    console.log('forgot password');
  }

  goToRegister(): void {
    this.router.navigate(['/signup']);
  }
}
