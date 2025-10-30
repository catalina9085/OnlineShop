import {Component, computed, input, model, Signal, signal} from '@angular/core';
import {OrderModel} from '../../../shared/domain/order.model';
import {SettingsService} from '../../settings.service';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {OrderCardComponent} from '../order-card/order-card.component';
import {SettingsStoreService} from '../../settings-store.service';
import {NotificationComponent} from '../../../notifications/notification/notification.component';

@Component({
  selector: 'app-order-list',
  imports: [MatButtonToggleModule, FormsModule, OrderCardComponent, NotificationComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  orders:Signal<OrderModel[]>=signal<OrderModel[]>([]);
  status=signal<string>("PAID");


  paidOrders=computed(()=>{
    return this.orders().filter(order=>order.status=='PAID');
  });
  pendingOrders=computed(()=>{
    return this.orders().filter(order=>order.status=='PENDING');
  });


  constructor(private store: SettingsStoreService) {
    this.orders=this.store.orders;
  }

  statusChanged($event: any) {
    this.status.set($event);
  }

  updateOrders() {
    this.store.refreshOrders();
  }
}
