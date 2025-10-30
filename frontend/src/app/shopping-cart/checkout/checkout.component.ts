import {Component, effect, input, OnInit, signal} from '@angular/core';
import {OrderModel} from '../../shared/domain/order.model';
import {CartService} from '../services/cart.service';
import {ShipmentModel} from '../../shared/domain/shipment.model';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatFormField} from '@angular/material/select';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {SettingsService} from '../../settings/settings.service';
import {ProductImageService} from '../../shared/services/product-image.service';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-checkout',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
    MatCardImage,
    HeaderComponent,
    NotificationComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent{
  orderId=input<number>(0);
  order=signal(new OrderModel());
  shipment=signal<ShipmentModel>(new ShipmentModel());
  imageUrls = signal<string[]>([]);
  link=signal('');


  constructor(private cartService:CartService,private imageService:ProductImageService){
    this.cartService.getShipment().subscribe(shipment=>this.shipment.set(shipment));
    effect(()=>{
      this.cartService.getOrder(this.orderId()).subscribe(order=>this.order.set(order));
    })
    effect(()=>{
      this.imageUrls.set(this.imageService.getImageUrlsForProducts(this.order().products));
    })
  }
  firstNameChanged($event:string){
    this.shipment.set({...this.shipment(),firstName:$event});
  }

  lastNameChanged($event:string){
    this.shipment.set({...this.shipment(),lastName:$event});
  }

  countryChanged($event:string){
    this.shipment.set({...this.shipment(),country:$event});
  }

  provinceChanged($event:string){
    this.shipment.set({...this.shipment(),province:$event});
  }

  townChanged($event:string){
    this.shipment.set({...this.shipment(),town:$event});
  }

  addressLine1Changed($event:string){
    this.shipment.set({...this.shipment(),addressLine1:$event});
  }

  addressLine2Changed($event:string){
    this.shipment.set({...this.shipment(),addressLine2:$event});
  }

  postalCodeChanged($event:string){
    this.shipment.set({...this.shipment(),postalCode:$event});
  }

  phoneNumberChanged($event:string){
    this.shipment.set({...this.shipment(),phoneNumber:$event});
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.cartService.saveShipment(this.shipment()).subscribe();
    }
  }

  placeOrder() {
    this.cartService.placeOrder(this.orderId()).subscribe(link=>this.link.set(link));
  }
}
