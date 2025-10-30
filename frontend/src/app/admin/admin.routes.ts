import {Routes} from '@angular/router';
import {NewProductModel} from './domain/newProduct.model';
import {NewProductComponent} from './new-product/new-product.component';
import {ProductListComponent} from './product-list/product-list.component';
import {OverviewComponent} from './overview/overview.component';
import {AllOrdersComponent} from './all-orders/all-orders.component';

export const adminRoutes:Routes=[
  {path:'new',component:NewProductComponent},
  {path:'new/:productId',component:NewProductComponent},
  {path:'products',component:ProductListComponent},
  {path:'overview',component:OverviewComponent},
  {path:'orders',component:AllOrdersComponent}
]
