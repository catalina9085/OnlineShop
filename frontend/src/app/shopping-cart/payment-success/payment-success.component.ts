import {Component, effect, input, signal} from '@angular/core';
import {CartService} from '../services/cart.service';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-payment-success',
  imports: [
    HeaderComponent,
    NotificationComponent
  ],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent{
  orderId=input<number>(-1);
  message=signal<string>('');

  constructor(private cartService:CartService){
    effect(() => {
      this.cartService.paymentSuccessful(this.orderId()).subscribe(_=>this.message.set("Thank you! Your order has been confirmed and is now available in your Order History."));
    });
  }

}
