import {Component, OnInit, signal} from '@angular/core';
import {WishlistModel} from './domain/wishlist.model';
import {WishlistService} from './services/wishlist.service';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ProductImageComponent} from '../shared/components/product-image/product-image.component';
import {ProductModel} from '../shared/domain/product.model';
import {HeaderComponent} from '../shared/components/header/header.component';
import {ProductCardComponent} from '../shared/components/product-card/product-card.component';
import {NotificationComponent} from '../notifications/notification/notification.component';

@Component({
  selector: 'app-wishlist',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ProductImageComponent,
    HeaderComponent,
    ProductCardComponent,
    NotificationComponent
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit{
  imageUrls=signal<string[]>([]);
  products=signal<ProductModel[]>([]);

  constructor(private wishlistService:WishlistService){
    this.wishlistService.getWishlist().subscribe(products=>{
      this.products.set(products);
      console.log(this.products());
    });
  }

  ngOnInit() {
    this.getImageUrlsFromBase64();
  }

  getImageUrlsFromBase64(mimeType: string = 'image/jpeg') {
    let urls=[] as string[];
    this.products().forEach(product=>{
      if (product.images && product.images.length > 0 && product.images[0].savingOption == 1) {
        const base64 = product.images[0].imageBase64;
        const byteString = atob(base64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([intArray], {type: mimeType});
        urls.push(URL.createObjectURL(blob)); // asta returnează un link de forma blob:http://...
      }
    })
    this.imageUrls.set(urls);
  }

  removeFromWishlist(id:number,index:number){
    this.wishlistService.removeFromWishList(id).subscribe(res=>{
      const products = [...this.products()];
      products.splice(index, 1);
      this.products.set(products);
    }
  );
  }

  addToCart(id: number) {
    this.wishlistService.addToCart(id).subscribe();
  }
}
