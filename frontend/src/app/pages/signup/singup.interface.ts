import { FormControl } from '@angular/forms';

export interface UserSignUpForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  avatarFile: FormControl<File | null>;
}
