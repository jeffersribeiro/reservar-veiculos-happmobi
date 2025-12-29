import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vehicle } from '../../pages/list-vehicles/vehicles.interface';

@Injectable({
  providedIn: 'root',
})
export class VehiclesApi {
  private http = inject(HttpClient);

  getById(id: string) {
    return this.http.get<Vehicle>('/vehicles/' + id);
  }

  listAvailableCars(filters: any) {
    return this.http.get<Vehicle[]>('/vehicles/available', { params: filters });
  }
}
