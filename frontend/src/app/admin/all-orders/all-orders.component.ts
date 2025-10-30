import {AfterViewInit, Component, signal, ViewChild} from '@angular/core';
import {OrderModel} from '../../shared/domain/order.model';
import {AdminService} from '../admin.service';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {
  MatCell,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatCard, MatCardContent, MatCardImage} from '@angular/material/card';
import {ProductImageService} from '../../shared/services/product-image.service';
import {ProductModel} from '../../home/models/product.model';
import {OrderProductModel} from '../../shared/domain/orderProduct.model';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {MatIcon} from '@angular/material/icon';
import {MatMiniFabButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-all-orders',
  imports: [
    MatDrawerContainer,
    MatTableModule,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatPaginatorModule,
    MatDrawer,
    MatDrawerContent,
    MatSortModule,
    MatCard,
    MatCardContent,
    MatCardImage,
    HeaderComponent,
    RouterLink,
  ],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements AfterViewInit{
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('drawer') drawer!: MatDrawer;

  orders=signal<OrderModel[]>([]);
  currentOrder=signal<OrderModel>(new OrderModel());

  readonly columns =['id','name','date','total','status','details'];
  readonly dataSource = new MatTableDataSource<OrderModel>();

  constructor(private adminService:AdminService,private imageService:ProductImageService){
    this.adminService.getOrders().subscribe(orders=>{
      this.orders.set(orders);
      this.dataSource.data=orders;
      console.log(this.orders());
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  closeDrawer() {
    this.drawer.close();
  }

  openDrawer(order:OrderModel){
    this.currentOrder.set(order);
    this.drawer.open();
  }

  getImageUrl(product:OrderProductModel){
    return this.imageService.getImageUrlFromBase641(product.imageBase64);
  }
  protected readonly open = open;
}
