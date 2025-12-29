import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { PillInputComponent } from '../../shared/components/pill-input/pill-input.component';
import { LinkButtonComponent } from '../../shared/components/link-button/link-button.component';
import { AvatarUploadComponent } from '../../shared/components/avatar-upload/avatar-upload.component';
import { RegisterService } from '../../shared/services/register.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSignUpForm } from './singup.interface';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PillInputComponent,
    ButtonComponent,
    LinkButtonComponent,
    AvatarUploadComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  readonly form: FormGroup<UserSignUpForm>;
  isSubmitting = false;

  avatarUrl: string | null = null;
  uploadEnabled = true;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly toast: ToastrService,
    private readonly registerService: RegisterService
  ) {
    this.form = this.fb.nonNullable.group<UserSignUpForm>(
      {
        name: this.fb.nonNullable.control('', {
          validators: [Validators.required, Validators.minLength(3)],
        }),
        email: this.fb.nonNullable.control('', {
          validators: [Validators.required, Validators.email],
        }),
        password: this.fb.nonNullable.control('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: this.fb.nonNullable.control('', {
          validators: [Validators.required],
        }),
        avatarFile: this.fb.control(null, {
          validators: Validators.required,
        }),
      },
      { validators: [this.passwordsMatchValidator] }
    );
  }

  onAvatarFileSelected(file: File) {
    this.form.patchValue({ avatarFile: file });
  }

  get displayName(): string {
    return (this.form.value.name ?? '').trim() || 'Usuário';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password, avatarFile } = this.form.getRawValue();

    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('password', password);

    if (avatarFile) {
      fd.append('avatarPhotoUrl', avatarFile, avatarFile.name);
    }

    this.registerService.register(fd).subscribe({
      next: () => this.goToLogin(),
      error: (err: HttpErrorResponse) => this.toast.error(err.error.message),
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private passwordsMatchValidator(group: any) {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p && c && p !== c ? { passwordsMismatch: true } : null;
  }

  get passwordsMismatch(): boolean {
    return !!this.form.errors?.['passwordsMismatch'];
  }
}
