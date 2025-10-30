import { Routes } from '@angular/router';
import {authGuard} from './auth/auth.guard';
import {HomePageComponent} from './home/home-page/home-page.component';
import {WishlistComponent} from './wishlist/wishlist.component';
import {ProductComponent} from './product/product.component';
import {ChatbotComponent} from './chatbot/chatbot.component';


export const routes: Routes = [
  {path:'auth',loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)},
  {path:'',children:[
      {path:'home',component:HomePageComponent},
      {path:'settings',loadChildren: () => import('./settings/settings.routes').then(m => m.settingsRoutes)},
      {path:'wishlist',component:WishlistComponent},
      {path:'admin',loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)},
      {path:'cart',loadChildren: () => import('./shopping-cart/cart.routes').then(m => m.cartRoutes)},
      {path:'product/:productId',component:ProductComponent},
      {path:'chat',component:ChatbotComponent}

    ], canActivate:[authGuard]}
];
