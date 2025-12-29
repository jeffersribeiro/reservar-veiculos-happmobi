import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

type ToastKind = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly base: Partial<IndividualConfig> = {
    toastClass: 'ngx-toastr app-toast',
    titleClass: 'app-toast__title',
    messageClass: 'app-toast__message',
    enableHtml: false,
    timeOut: 3200,
    closeButton: true,
    progressBar: true,
    tapToDismiss: true,
  };

  constructor(private readonly toastr: ToastrService) {}

  success(
    message: string,
    title = 'Success',
    opts?: Partial<IndividualConfig>
  ) {
    this.show('success', message, title, opts);
  }

  error(message: string, title = 'Error', opts?: Partial<IndividualConfig>) {
    this.show('error', message, title, { timeOut: 5200, ...opts });
  }

  info(message: string, title = 'Info', opts?: Partial<IndividualConfig>) {
    this.show('info', message, title, opts);
  }

  warning(
    message: string,
    title = 'Warning',
    opts?: Partial<IndividualConfig>
  ) {
    this.show('warning', message, title, opts);
  }

  apiError(err: unknown, fallback = 'Something went wrong') {
    const msg =
      (err as any)?.error?.message ?? (err as any)?.message ?? fallback;

    this.error(String(msg));
  }

  private show(
    kind: ToastKind,
    message: string,
    title: string,
    opts?: Partial<IndividualConfig>
  ) {
    const config = { ...this.base, ...opts } as Partial<IndividualConfig>;

    switch (kind) {
      case 'success':
        return this.toastr.success(message, title, config);
      case 'error':
        return this.toastr.error(message, title, config);
      case 'info':
        return this.toastr.info(message, title, config);
      case 'warning':
        return this.toastr.warning(message, title, config);
    }
  }
}
