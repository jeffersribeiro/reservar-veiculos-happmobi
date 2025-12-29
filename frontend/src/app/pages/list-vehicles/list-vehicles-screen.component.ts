import { Component, inject } from '@angular/core';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Vehicle, VehicleGroup } from './vehicles.interface';
import { VehiclesApi } from '../../shared/services/vehicles.service';

@Component({
  selector: 'app-list-vehicles-screen',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent],
  templateUrl: './list-vehicles-screen.component.html',
  styleUrl: './list-vehicles-screen.component.css',
})
export class ListVehiclesScreenComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(VehiclesApi);

  readonly params$: Observable<any> = this.route.queryParamMap.pipe(
    map((q) => {
      const bodyTypes = q.getAll('bodyTypes') ?? null;
      const seats = q.getAll('seats') ?? null;
      const engineSizes = q.getAll('engineSizes') ?? null;

      return { bodyTypes, seats, engineSizes };
    })
  );

  readonly vehicles$: Observable<Vehicle[]> = this.params$.pipe(
    switchMap((p) =>
      this.api.listAvailableCars(p).pipe(
        map((response) =>
          response.map((e) => ({
            ...e,
            imageUrls: e.imageUrls.map(
              (e) => `http://localhost:3000/uploads/${e}`
            ),
          }))
        )
      )
    )
  );

  readonly groupedVehicles$: Observable<VehicleGroup[]> = this.vehicles$.pipe(
    map((vehicles) => {
      const groups = new Map<string, Vehicle[]>();

      for (const v of vehicles) {
        const key = (v.category ?? 'OTHER').trim() || 'OTHER';
        const list = groups.get(key) ?? [];
        list.push(v);
        groups.set(key, list);
      }

      return Array.from(groups.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, list]) => ({ category, vehicles: list }));
    })
  );

  trackGroup = (_: number, g: VehicleGroup) => g.category;
  trackVehicle = (i: number) => i;

  back() {
    this.router.navigate(['/filter'], {
      queryParamsHandling: 'preserve',
    });
  }

  openDetails(v: any) {
    this.router.navigate(['/vehicles', v._id]);
  }
}
