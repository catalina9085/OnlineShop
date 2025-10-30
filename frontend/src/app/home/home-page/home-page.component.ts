import {Component, inject, signal, ViewChild} from '@angular/core';
import {productsStore} from './+store/home.store';
import {MatCardModule} from '@angular/material/card';
import {ProductCardComponent} from '../../shared/components/product-card/product-card.component';
import {FilterComponent} from '../filter/filter.component';
import {FilterModel} from '../../shared/domain/filter.model';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ProductService} from '../../shared/components/product-card/services/product.service';
import {MatIcon} from '@angular/material/icon';
import {ProductModel} from '../../shared/domain/product.model';
import {NgClass} from '@angular/common';
import {NotificationComponent} from '../../notifications/notification/notification.component';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-home-page',
  imports: [
    ProductCardComponent,
    FilterComponent,
    MatIconButton,
    MatIcon,
    NgClass,
    NotificationComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers:[productsStore]
})
export class HomePageComponent {
  store=inject(productsStore);

  constructor(private productService:ProductService){
  }

  filterChanged($event: FilterModel|null) {
    this.store.updateFilter($event);
  }

  toggleFavourite(product:ProductModel) {
    if(product.inWishlist)
      this.productService.removeFromWishlist(product.id);
    else
      this.productService.addToWishlist(product.id);
    const updated = this.store.products().map(p =>
      p.id === product.id ? { ...p, inWishlist: !p.inWishlist } : p
    );
    this.store.updateProducts(updated);
  }
}
