import {Component, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {NotificationsModel} from '../domain/notifications.model';
import {SettingsService} from '../settings.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {SettingsStoreService} from '../settings-store.service';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-notifications',
  imports: [MatIconModule, MatCheckboxModule, FormsModule, MatButton, NotificationComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  preferences=signal<NotificationsModel>(new NotificationsModel());

  constructor(private store: SettingsStoreService,private settingsService:SettingsService) {
    this.preferences=this.store.preferences;
  }

  offersChanged($event: boolean) {
    this.preferences.set({...this.preferences(),offers:$event});
    console.log(this.preferences());
  }

  orderStatusChanged($event: boolean) {
    this.preferences.set({...this.preferences(),orderStatus:$event});
  }

  newArrivalsChanged($event: boolean) {
    this.preferences.set({...this.preferences(),newArrivals:$event});
  }

  viaEmailChanged($event: boolean) {
    this.preferences.set({...this.preferences(),viaEmail:$event});
  }

  viaPushChanged($event: boolean) {
    this.preferences.set({...this.preferences(),viaPush:$event});
  }

  savePreferences() {
    this.settingsService.saveNotificationsPreferences(this.preferences()).subscribe();
  }
}
