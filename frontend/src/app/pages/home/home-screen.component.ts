import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGreetingComponent } from '../../shared/components/user-greeting/user-greeting.component';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { firstValueFrom } from 'rxjs';
import { ReserveApi } from '../../shared/services/reserve.service';
import { Vehicle } from '../list-vehicles/vehicles.interface';

export type Reserve = {
  _id: '69529202143f4a2e516493ad';
  userId: '694af628fbd9ab9bbf3dede8';
  status: 'ACTIVE';
  _schemaVersion: 1;
  createdAt: '2025-12-29T14:36:50.383Z';
  updatedAt: '2025-12-29T14:36:50.383Z';
  __v: 0;
  vehicle: Vehicle;
};

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, UserGreetingComponent, VehicleCardComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.css',
})
export class HomeScreenComponent {
  userName: string = '';
  avatarUrl: string = '';

  lastBookings: Vehicle[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private reserveApi: ReserveApi
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
    this.loadProfileReservations();
  }

  private async loadProfile() {
    const data = await firstValueFrom(this.userService.loadProfile());
    this.avatarUrl = `http://localhost:3000/uploads/${data.avatarPhotoUrl}`;
    this.userName = data.name;
  }

  private async loadProfileReservations() {
    const reserves = await firstValueFrom(this.reserveApi.me());

    this.lastBookings = reserves.map((e) => ({
      ...e.vehicle,
      imageUrls: e.vehicle.imageUrls.map(
        (e) => `http://localhost:3000/uploads/${e}`
      ),
    }));
  }

  onSearch() {
    this.router.navigate(['/filter']);
  }

  onFilter() {
    this.router.navigate(['/filter']);
  }

  onScanQr() {}
}
