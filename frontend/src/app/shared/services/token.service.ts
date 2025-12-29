import { computed, Injectable, signal } from '@angular/core';

export type JwtPayload = {
  sub?: string;
  email?: string;
  exp?: number;
  [k: string]: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public readonly tokenKey = 'auth_token';

  private readonly _token = signal<string | null>(this.getStoredToken());
  readonly token = computed(() => this._token());

  readonly isAuthenticated = computed(() => {
    const t = this._token();
    return !!t && !this.isTokenExpired(t);
  });

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this._token.set(token);
  }

  public clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this._token.set(null);
  }

  public getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public decodeJwt(token: string): JwtPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const payloadJson = this.base64UrlDecode(parts[1]);
      return JSON.parse(payloadJson) as JwtPayload;
    } catch {
      return null;
    }
  }

  public isTokenExpired(token: string): boolean {
    const payload = this.decodeJwt(token);
    const exp = payload?.exp;
    if (!exp || typeof exp !== 'number') return false;

    const nowSeconds = Math.floor(Date.now() / 1000);
    return exp <= nowSeconds;
  }

  public base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

    const decoded = atob(padded);

    const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
}
