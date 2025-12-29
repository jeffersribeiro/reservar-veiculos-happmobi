import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { JwtPayload, TokenService } from './token.service';
import { UserModel } from '../../pages/profile/profile.interface';

export type AuthUser = {
  id?: string;
  email?: string;
  raw?: JwtPayload;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  readonly user = computed<AuthUser | null>(() => {
    const t = this.tokenService.token();
    if (!t) return null;

    const payload = this.tokenService.decodeJwt(t);
    return {
      id: (payload?.sub as string | undefined) ?? undefined,
      email: (payload?.email as string | undefined) ?? undefined,
      raw: payload ?? undefined,
    };
  });

  loadProfile() {
    return this.http.get<UserModel>('/users/me');
  }

  updateProfile(data: FormData) {
    return this.http.patch('/users', data);
  }
}
