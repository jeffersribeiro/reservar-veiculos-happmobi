import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ToggleOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css',
})
export class ToggleComponent {
  @Input() label: string | null = null;
  @Input() value: string | null = null;
  @Input() isActive: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  select(v: string | null) {
    if (!v) return;
    this.value = v;
    this.valueChange.emit(v);
  }

  trackByValue = (_: number, o: ToggleOption) => o.value;
}
