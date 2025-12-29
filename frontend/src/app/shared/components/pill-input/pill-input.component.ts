import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pill-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PillInputComponent),
      multi: true,
    },
  ],
  styleUrl: './pill-input.component.css',
  templateUrl: './pill-input.component.html',
})
export class PillInputComponent implements ControlValueAccessor, OnInit {
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() autocomplete: string | null = null;
  @Input() formControlName: string = 'defaultFormControlName';

  @Input() messages: Partial<Record<string, string>> = {
    required: 'This field is required',
    minlength: 'Too short',
    email: 'Invalid email',
  };

  control: FormControl = new FormControl();
  validators = Validators;
  value: string | null = null;

  onChange: any = () => {};
  onTouch: any = () => {};

  controlContainer = inject(ControlContainer);
  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    if (
      this.controlContainer.control &&
      this.controlContainer.control.get(this.formControlName)
    ) {
      this.control = this.controlContainer.control.get(
        this.formControlName
      ) as FormControl;
    }
  }

  get showError(): boolean {
    const c = this.control;
    return !!c && c.touched && c.invalid;
  }

  get errorMessage(): string | null {
    const c = this.control;
    if (!c?.errors) return null;

    const firstKey = Object.keys(c.errors)[0];
    if (!firstKey) return null;

    if (this.messages[firstKey]) return this.messages[firstKey]!;

    return 'Invalid value';
  }

  writeValue(v: string | null): void {
    this.value = v ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
