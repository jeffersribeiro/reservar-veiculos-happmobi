import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vehicle } from '../../pages/list-vehicles/vehicles.interface';
import { Reserve } from '../../pages/home/home-screen.component';

@Injectable({
  providedIn: 'root',
})
export class ReserveApi {
  private readonly http = inject(HttpClient);

  reserve(id: string) {
    return this.http.post('/reservations/' + id, null);
  }

  me() {
    return this.http.get<Reserve[]>('/reservations/me');
  }
}
