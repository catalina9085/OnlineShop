import {Injectable, signal} from '@angular/core';
import {OrderModel} from '../shared/domain/order.model';
import {NotificationsModel} from './domain/notifications.model';
import {SettingsService} from './settings.service';
import {ShipmentModel} from '../shared/domain/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsStoreService {
  private _orders = signal<OrderModel[]>([]);
  orders = this._orders.asReadonly();

  preferences = signal<NotificationsModel>(new NotificationsModel());
  shipment=signal<ShipmentModel>(new ShipmentModel());

  private ordersLoaded = false;
  private notificationsLoaded = false;
  private shipmentLoaded=false;

  constructor(private settingsService: SettingsService) {}

  loadOrders() {
    if (!this.ordersLoaded) {
      this.settingsService.getOrders().subscribe((o) => {
        this._orders.set(o);
        this.ordersLoaded = true;
      });
    }
  }

  loadNotifications() {
    if (!this.notificationsLoaded) {
      this.settingsService.getNotificationsPreferences().subscribe((prefs) => {
        this.preferences.set(prefs);
        this.notificationsLoaded = true;
      });
    }
  }

  loadShipment() {
    if (!this.shipment) {
      this.settingsService.getShipment().subscribe((prefs) => {
        this.shipment.set(prefs);
        this.shipmentLoaded = true;
      });
    }
  }
  refreshOrders() {
    // folosit după delete sau update
    this.settingsService.getOrders().subscribe((o) => {
      this._orders.set(o);
    });
  }
}
