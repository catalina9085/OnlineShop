import {Component, effect, inject, input, signal} from '@angular/core';
import {NewProductModel} from '../domain/newProduct.model';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatIcon} from '@angular/material/icon';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {MatButtonModule} from '@angular/material/button';
import {productStore} from './+store/product.store';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-new-product',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    MatIcon,
    HeaderComponent,
    MatButtonModule,
    NotificationComponent,
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
  providers: [productStore]
})
export class NewProductComponent {
  productId=input<number|undefined>(undefined);
  store=inject(productStore);
  product=this.store.newProduct;

  constructor(){
    effect(() => {
      console.log(this.productId());
      this.store.updateProductId(this.productId());
    });
  }

  emptyProduct(){
    return new NewProductModel();
  }

  getStars(rating: number) {
    return new Array(rating);
  }

  getDate(date:string){
    return new Date(date).toLocaleDateString();
  }

  protected readonly Object = Object;
}
