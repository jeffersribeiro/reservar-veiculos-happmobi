import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

export type TabKey = 'home' | 'bookings' | 'central' | 'profile';

export interface BottomTabItem {
  key: TabKey;
  label: string;
  icon: 'home' | 'bookings' | 'central' | 'profile';
}

@Component({
  selector: 'app-bottom-tabs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bottom-tabs.component.html',
  styleUrls: ['./bottom-tabs.component.css'],
})
export class BottomTabsComponent {
  private readonly router = inject(Router);

  @Input() tabs: BottomTabItem[] = [
    { key: 'home', label: 'INÍCIO', icon: 'home' },
    { key: 'bookings', label: 'AGENDAMENTOS', icon: 'bookings' },
    { key: 'central', label: 'CENTRAL', icon: 'central' },
    { key: 'profile', label: 'PERFIL', icon: 'profile' },
  ];

  @Input() currentTab: TabKey = this.mapUrlToTab(this.router.url);

  @Output() tabChange = new EventEmitter<TabKey>();

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentTab = this.mapUrlToTab(e.urlAfterRedirects);
      });
  }

  select(key: TabKey) {
    this.currentTab = key;
    this.tabChange.emit(key);
    this.router.navigate(['/' + key]);
  }

  private mapUrlToTab(url: string): TabKey {
    const clean = url.split('?')[0].split('#')[0];

    if (clean.startsWith('/bookings')) return 'bookings';
    if (clean.startsWith('/central')) return 'central';
    if (clean.startsWith('/profile')) return 'profile';
    return 'home';
  }

  trackByKey = (_: number, item: BottomTabItem) => item.key;
}
