import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { ToastService } from '../../shared/services/toast.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ReserveApi } from '../../shared/services/reserve.service';
import { Vehicle } from '../list-vehicles/vehicles.interface';
import { VehiclesApi } from '../../shared/services/vehicles.service';

@Component({
  selector: 'app-vehicle-detail-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './vehicle-detail-screen.component.html',
  styleUrl: './vehicle-detail-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailScreenComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly vehicleApi = inject(VehiclesApi);
  private readonly reserveApi = inject(ReserveApi);
  private readonly toast = inject(ToastService);

  index = 0;
  reserving = false;

  readonly vm$: Observable<Vehicle> = this.route.paramMap.pipe(
    map((p) => p.get('id') ?? ''),
    switchMap((id) => this.vehicleApi.getById(id))
  );

  images(vm: Vehicle): string[] {
    return (vm.imageUrls ?? []).filter(Boolean);
  }

  currentImage(vm: Vehicle): string {
    const imgs = this.images(vm);
    return `http://localhost:3000/uploads/${imgs[this.index]}`;
  }

  prev(vm: Vehicle, ev: MouseEvent) {
    ev.stopPropagation();
    const imgs = this.images(vm);
    if (imgs.length <= 1) return;
    this.index = (this.index - 1 + imgs.length) % imgs.length;
  }

  next(vm: Vehicle, ev: MouseEvent) {
    ev.stopPropagation();
    const imgs = this.images(vm);
    if (imgs.length <= 1) return;
    this.index = (this.index + 1) % imgs.length;
  }

  goTo(i: number, vm: Vehicle, ev: MouseEvent) {
    ev.stopPropagation();
    const imgs = this.images(vm);
    if (i < 0 || i >= imgs.length) return;
    this.index = i;
  }

  reservar(vm: Vehicle) {
    if (this.reserving) return;
    this.reserving = false;

    this.reserveApi.reserve(vm._id).subscribe({
      next: () => {
        this.toast.success('Reserva feita com sucesso');
      },
    });
  }

  formatEngine(engineSizes?: string | null) {
    if (!engineSizes) return '-';
    return engineSizes.replace('_', '.');
  }

  formatMoney(v?: number | null) {
    if (v == null) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(v);
  }
}
