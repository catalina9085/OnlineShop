import {Component, input, OnInit, signal} from '@angular/core';
import {ProductModel} from '../../domain/product.model';
import {MatCardImage} from '@angular/material/card';
import {ProductImageService} from '../../services/product-image.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-image',
  imports: [
    MatCardImage,
    RouterLink
  ],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss'
})
export class ProductImageComponent implements OnInit{
  product=input<ProductModel>(new ProductModel());
  imageUrl=signal<string|null>(null);

  constructor(private imageService:ProductImageService){}

  ngOnInit() {
    this.imageUrl.set(this.imageService.getImageUrlFromBase64(this.product()));
  }

}
