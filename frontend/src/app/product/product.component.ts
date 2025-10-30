import {Component, effect, input, OnInit, signal} from '@angular/core';
import {ProductModel} from '../shared/domain/product.model';
import {ProductImageService} from '../shared/services/product-image.service';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {ProductService} from './services/product.service';
import {MatDivider} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SidenavComponent} from '../shared/components/sidenav/sidenav.component';
import {ReviewsComponent} from './reviews/reviews.component';
import {HeaderComponent} from '../shared/components/header/header.component';
import {ProductImageComponent} from '../shared/components/product-image/product-image.component';
import {take} from 'rxjs';
import {NotificationComponent} from '../notifications/notification/notification.component';
import {ProductCardComponent} from '../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product',
  imports: [
    MatDivider,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
    SidenavComponent,
    ReviewsComponent,
    HeaderComponent,
    MatCard,
    MatCardContent,
    ProductImageComponent,
    NotificationComponent,
    ProductCardComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{
  productId=input(-1);
  product=signal<ProductModel>(new ProductModel());
  imageUrls=signal<string[]>([]);
  recommended=signal<ProductModel[]>([]);

  constructor(private imageService:ProductImageService,private productService:ProductService) {
    effect(() => {
      this.productService.getProduct(this.productId()).subscribe(res=>{
        this.product.set(res.product);
        this.recommended.set(res.recommended);
        this.imageUrls.set(this.imageService.getImageUrlsForProduct(res.product));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  ngOnInit() {
  }

  getStars(rating: number) {
    return new Array(rating);
  }

  addToCart() {
    this.productService.addToCart(this.productId()).subscribe();
  }

  addToWishlist() {
    this.productService.addToWishList(this.productId()).subscribe();
  }
}
