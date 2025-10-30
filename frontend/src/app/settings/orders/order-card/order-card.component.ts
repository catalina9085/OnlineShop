import {Component, effect, input, OnInit, output, signal} from '@angular/core';
import {OrderModel} from '../../../shared/domain/order.model';
import {MatCard, MatCardContent, MatCardImage, MatCardModule} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {SettingsService} from '../../settings.service';
import {ProductImageService} from '../../../shared/services/product-image.service';

@Component({
  selector: 'app-order-card',
  imports: [
    MatCardModule,
    MatButton
  ],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent implements OnInit{
  order=input<OrderModel>(new OrderModel());
  orderDeleted=output<boolean>();
  imageUrls = signal<string[]>([]);

  constructor(private settingsService:SettingsService,private imageService:ProductImageService){}

  ngOnInit() {
    this.imageUrls.set(this.imageService.getImageUrlsForProducts(this.order().products));
  }

  removeOrder() {
    this.settingsService.removeOrderFromHistory(this.order().id).subscribe(res=>this.orderDeleted.emit(true));
  }
}
