import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';

export type AuthResponse = {
  userId: string;
  expiresAt: Date;
  accessToken: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`/auth/session/start`, {
        email,
        password,
      })
      .pipe(tap((res) => this.tokenService.setToken(res.accessToken)));
  }

  logout(): void {
    this.tokenService.clearToken();
  }

  getAccessToken(): string | null {
    return this.tokenService.token();
  }
}
