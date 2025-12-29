import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../pages/list-vehicles/vehicles.interface';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
  @Input({ required: true }) vm!: Vehicle;
  @Output() details = new EventEmitter<Vehicle>();

  index = 0;

  get images(): string[] {
    return (this.vm?.imageUrls ?? []).filter((x) => !!x);
  }

  get currentImage(): string {
    return this.images[this.index] ?? 'assets/vehicle-placeholder.svg';
  }

  emitDetails() {
    this.details.emit(this.vm);
  }

  onKey(ev: KeyboardEvent) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.emitDetails();
    }
  }

  prev(ev: MouseEvent) {
    ev.stopPropagation();
    if (this.images.length <= 1) return;
    this.index = (this.index - 1 + this.images.length) % this.images.length;
  }

  next(ev: MouseEvent) {
    ev.stopPropagation();
    if (this.images.length <= 1) return;
    this.index = (this.index + 1) % this.images.length;
  }

  goTo(i: number, ev: MouseEvent) {
    ev.stopPropagation();
    if (i < 0 || i >= this.images.length) return;
    this.index = i;
  }
}
