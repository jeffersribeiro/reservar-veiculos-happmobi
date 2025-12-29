import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent {
  @Input({ required: true }) label = '';
  @Input() checked = false;
  @Input() disabled = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  select(next: boolean) {
    if (this.disabled) return;

    this.checked = next;
    this.checkedChange.emit(next);
  }
}
