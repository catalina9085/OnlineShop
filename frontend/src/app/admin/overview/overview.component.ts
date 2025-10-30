import {Component, signal} from '@angular/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {ProductModel} from '../../shared/domain/product.model';
import {OrderModel} from '../../shared/domain/order.model';
import {OverviewModel} from '../domain/overview.model';
import {AdminService} from '../admin.service';
import {MatIcon} from '@angular/material/icon';
import {ProductImageComponent} from '../../shared/components/product-image/product-image.component';
import {RouterLink} from '@angular/router';
import {MatCard, MatCardContent} from '@angular/material/card';
import {RevenueModel} from '../domain/revenue.model';
import {RevenueChartComponent} from './revenue-chart/revenue-chart.component';
import {ProductCardComponent} from '../../shared/components/product-card/product-card.component';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-overview',
  imports: [
    HeaderComponent,
    MatIcon,
    ProductImageComponent,
    RouterLink,
    MatCard,
    MatCardContent,
    RevenueChartComponent,
    ProductCardComponent,
    NotificationComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  overview=signal<OverviewModel>(new OverviewModel());
  constructor(private adminService:AdminService) {
    this.adminService.getOverview().subscribe(overview=>{
      this.overview.set(overview)
      console.log(overview);
      console.log(this.overview());
    });
  }

}
