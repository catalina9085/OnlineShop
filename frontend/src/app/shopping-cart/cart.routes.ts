import {Routes} from '@angular/router';
import {ShoppingCartComponent} from './shopping-cart.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';
import {PaymentCanceledComponent} from './payment-canceled/payment-canceled.component';

export const cartRoutes:Routes=[
  {path:'',component:ShoppingCartComponent},
  {path:'checkout/:orderId',component:CheckoutComponent},
  {path:'payment-success/:orderId',component:PaymentSuccessComponent},
  {path:'payment-cancelled/:orderId',component:PaymentCanceledComponent}

]
