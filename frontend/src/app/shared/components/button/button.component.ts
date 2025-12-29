import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() label = 'ENTRAR';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() variant: 'primary' | 'secondary' = 'primary';
}
