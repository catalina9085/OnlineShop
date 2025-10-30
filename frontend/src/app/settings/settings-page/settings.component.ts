import {Component} from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {SettingsStoreService} from '../settings-store.service';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NotificationComponent} from '../../notifications/notification/notification.component';



@Component({
  selector: 'app-settings',
  imports: [MatDividerModule, MatListModule, RouterOutlet, RouterLinkActive, RouterLink,
    MatIconButton, MatIcon, NotificationComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',

})
export class SettingsComponent {
  constructor(private store: SettingsStoreService) {
    console.log("in here");
    this.store.loadOrders();
    this.store.loadNotifications();
    this.store.loadShipment();
  }
}
