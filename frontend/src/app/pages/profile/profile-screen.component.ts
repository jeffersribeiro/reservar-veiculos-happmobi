import { Component, OnInit } from '@angular/core';
import { AvatarUploadComponent } from '../../shared/components/avatar-upload/avatar-upload.component';
import { PillInputComponent } from '../../shared/components/pill-input/pill-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { UpdateUserForm, UserModel } from './profile.interface';
import { finalize, firstValueFrom } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-profile-screen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AvatarUploadComponent,
    PillInputComponent,
    ButtonComponent,
  ],
  templateUrl: './profile-screen.component.html',
  styleUrl: './profile-screen.component.css',
})
export class ProfileScreenComponent implements OnInit {
  readonly form: FormGroup;
  isSubmitting = false;

  avatarUrl: string | null = null;
  uploadEnabled = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly userService: UserService
  ) {
    this.form = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.email],
      }),
      avatarFile: this.fb.control<File | null>(null, {
        validators: Validators.required,
      }),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  private async loadProfile() {
    this.form.disable({ emitEvent: false });

    try {
      const data = await firstValueFrom(this.userService.loadProfile());
      this.form.patchValue(this.toFormValue(data));
    } finally {
      this.form.enable({ emitEvent: false });
    }
  }

  private toFormValue(dto: UserModel) {
    this.avatarUrl = `http://localhost:3000/uploads/${dto.avatarPhotoUrl}`;
    return {
      name: dto.name ?? '',
      email: dto.email ?? '',
    };
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

    const { name, email, avatarFile } = this.form.getRawValue();

    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);

    if (avatarFile) {
      fd.append('avatarPhotoUrl', avatarFile, avatarFile.name);
    }

    this.userService
      .updateProfile(fd)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe(() => {
        this.toast.success('Atualizado com sucesso');
      });
  }
}
