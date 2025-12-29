import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  toMessage(err: unknown): string {
    if (!(err instanceof HttpErrorResponse)) return 'Unexpected error';

    if (err.status === 0) return 'Network error (API offline or CORS blocked)';

    const msg = (err.error as any)?.message;

    if (Array.isArray(msg) && msg.length) return msg.join('\n');
    if (typeof msg === 'string' && msg.trim()) return msg;

    switch (err.status) {
      case 400:
        return 'Bad request';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'You do not have permission to do that.';
      case 404:
        return 'Not found';
      case 409:
        return 'Conflict';
      case 500:
        return 'Server error. Try again later.';
      default:
        return `Request failed (${err.status})`;
    }
  }
}
