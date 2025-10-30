import {Component, signal} from '@angular/core';
import {CartItemModel} from './domain/cartItem.model';
import {CartService} from './services/cart.service';
import {ProductImageService} from '../shared/services/product-image.service';
import {ProductModel} from '../shared/domain/product.model';
import {NgClass, NgStyle} from '@angular/common';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {debounceTime, Subject} from 'rxjs';
import {HeaderComponent} from '../shared/components/header/header.component';
import {Router, RouterLink} from '@angular/router';
import {NotificationComponent} from '../notifications/notification/notification.component';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    NgClass,
    MatIconButton,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    RouterLink,
    NotificationComponent
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  items=signal<CartItemModel[]>([]);

  constructor(private cartService:CartService,private imageService:ProductImageService,
              private router:Router) {
    this.cartService.getItems().subscribe(items=>this.items.set(items));
  }

  getImageUrl(product:ProductModel){
    return this.imageService.getImageUrlFromBase64(product);
  }

  decrement(i: number) {
    const currentItems = this.items(); // Obții array-ul curent
    const updatedItems = [...currentItems]; // Faci o copie

    if (updatedItems[i].quantity > 1) {
      updatedItems[i] = {
        ...updatedItems[i],
        quantity: updatedItems[i].quantity - 1
      };
      this.items.set(updatedItems);
      this.cartService.updateQuantity(updatedItems[i].id,updatedItems[i].quantity).subscribe();
    }
  }
  increment(i: number) {
    const currentItems = this.items(); // Obții array-ul curent
    const updatedItems = [...currentItems]; // Faci o copie

    if (updatedItems[i].quantity <updatedItems[i].product.stock) {
      updatedItems[i] = {
        ...updatedItems[i],
        quantity: updatedItems[i].quantity +1
      };
      this.items.set(updatedItems);
      this.cartService.updateQuantity(updatedItems[i].id,updatedItems[i].quantity).subscribe();
    }
  }

  getTotal(){
    let total=0;
    this.items().forEach(item=>{
      total+=(item.quantity*item.product.finalPrice)
    })
    return total;
  }

  placeOrder() {
    this.cartService.createOrder().subscribe(orderId=>{
      this.router.navigate(['/cart/checkout',orderId])
    })
  }

  deleteFromCart(itemId: number, i: number) {
    console.log(itemId,i);
    this.cartService.deleteFromCart(itemId).subscribe(_=>{
      let updatedItems=[...this.items()];
      updatedItems.splice(i,1);
      this.items.set(updatedItems);
    })
  }
}
