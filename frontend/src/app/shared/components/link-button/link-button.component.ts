import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.css'],
})
export class LinkButtonComponent {
  @Input() label = '';
  @Input() href: string | null = null;
  @Input() target: '_self' | '_blank' = '_self';
}
