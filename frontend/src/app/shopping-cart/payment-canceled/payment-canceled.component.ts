import {Component, effect, input, signal} from '@angular/core';
import {CartService} from '../services/cart.service';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-payment-canceled',
  imports: [
    HeaderComponent,
    NotificationComponent
  ],
  templateUrl: './payment-canceled.component.html',
  styleUrl: './payment-canceled.component.scss'
})
export class PaymentCanceledComponent {
  orderId=input<number>(-1);
  message=signal<string>('');

  constructor(private cartService:CartService){
    effect(() => {
      this.cartService.paymentCanceled(this.orderId()).subscribe(_=>this.message.set("We’ve saved your order as pending. You can complete it later from your order history."));
    });
  }
}
