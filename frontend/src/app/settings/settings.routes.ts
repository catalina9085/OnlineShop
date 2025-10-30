import {Routes} from '@angular/router';
import {SettingsComponent} from './settings-page/settings.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {OrderListComponent} from './orders/order-list/order-list.component';
import {AccountComponent} from './account/account.component';
import {ShipmentComponent} from './shipment/shipment.component';

export const settingsRoutes:Routes=[
  {path:'',component:SettingsComponent,children:[
      {path:'',redirectTo:"/settings/notifications",pathMatch:"full"},
      {path:'notifications',component:NotificationsComponent},
      {path:'orders',component:OrderListComponent},
      {path:'account',component:AccountComponent},
      {path:'shipment',component:ShipmentComponent},
    ]}
];
