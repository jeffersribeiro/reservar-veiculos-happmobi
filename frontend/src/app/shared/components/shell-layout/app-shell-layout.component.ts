import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomTabsComponent } from '../bottom-tabs/bottom-tabs.component';
@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterOutlet, BottomTabsComponent],
  templateUrl: './app-shell-layout.component.html',
  styleUrls: ['./app-shell-layout.component.css'],
})
export class AppShellLayoutComponent {}
