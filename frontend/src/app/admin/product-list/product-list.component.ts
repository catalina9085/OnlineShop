import {Component, signal} from '@angular/core';
import {ProductModel} from '../../shared/domain/product.model';
import {AdminService} from '../admin.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ProductImageComponent} from '../../shared/components/product-image/product-image.component';
import {FilterComponent} from '../../home/filter/filter.component';
import {ProductCardComponent} from '../../shared/components/product-card/product-card.component';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-product-list',
  imports: [
    MatCard,
    MatCardContent,
    MatIconModule,
    MatIconButton,
    ProductImageComponent,
    RouterLink,
    HeaderComponent,
    ProductCardComponent,
    NotificationComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  products=signal<ProductModel[]>([]);

  constructor(private adminService:AdminService){
    this.adminService.getProducts().subscribe(products=>this.products.set(products));
  }

  deleteProduct(id:number,index:number){
    this.adminService.deleteProduct(id).subscribe(_=>{
      let updatedProducts=[...this.products()]
      updatedProducts.splice(index,1);
      this.products.set(updatedProducts);
    });
  }

}
