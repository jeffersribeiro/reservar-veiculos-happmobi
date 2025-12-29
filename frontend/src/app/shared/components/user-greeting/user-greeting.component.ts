import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-user-greeting',
  templateUrl: './user-greeting.component.html',
  styleUrls: ['./user-greeting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGreetingComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) avatarUrl!: string;

  @Input() showFirstNameOnly = false;

  get displayName(): string {
    if (!this.showFirstNameOnly) return this.name;
    return this.name.trim().split(/\s+/)[0] ?? this.name;
  }
}
