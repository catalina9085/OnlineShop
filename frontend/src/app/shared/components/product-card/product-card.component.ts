import {AfterViewInit, Component, ElementRef, input, OnInit, signal, ViewChild} from '@angular/core';
import {ProductModel} from '../../domain/product.model';
import {MatCardModule} from '@angular/material/card';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from './services/product.service';
import {ProductImageComponent} from '../product-image/product-image.component';
import {RouterLink} from '@angular/router';
import {AdminService} from '../../../admin/admin.service';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ProductImageComponent, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent{
  product=input<ProductModel>(new ProductModel());
  //imageUrl=signal<string|null>(null);

  constructor(private productService:ProductService){}




}
