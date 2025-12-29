import { Observable, tap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type RegisterInput = {
  name?: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  accessToken?: string;
  userId?: string;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private readonly http = inject(HttpClient);

  private readonly tokenKey = 'auth_token';

  register(input: FormData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`/users`, input).pipe(
      tap((res) => {
        if (res.accessToken) {
          localStorage.setItem(this.tokenKey, res.accessToken);
        }
      })
    );
  }
}
