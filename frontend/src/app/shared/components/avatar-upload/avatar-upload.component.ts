import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarUploadComponent {
  @Input() uploadEnabled = true;
  @Input() url: string | null = null;
  @Input() fallbackUrl: string | null = null;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() cleared = new EventEmitter<void>();

  get imageSrc(): string | null {
    return this.url ?? this.fallbackUrl;
  }

  onPick(input: HTMLInputElement) {
    if (!this.uploadEnabled) return;

    const file = input.files?.[0];
    if (!file) return;

    this.fileSelected.emit(file);
    const objectUrl = URL.createObjectURL(file);
    this.url = objectUrl;
    input.value = '';
  }

  onClear() {
    if (!this.uploadEnabled) return;
    this.url = null;
    this.cleared.emit();
  }
}
