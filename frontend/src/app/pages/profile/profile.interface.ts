export interface UserModel {
  avatarPhotoUrl: string;
  createdAt: Date;
  email: string;
  isActive: boolean;
  name: string;
  roles: string[];
  updatedAt: Date;
}

import { FormControl } from '@angular/forms';

export interface UpdateUserForm {
  name: FormControl<string>;
  avatarPhotoUrl: string;
}
