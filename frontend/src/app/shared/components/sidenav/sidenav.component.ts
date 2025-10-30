import {Component, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ProductService} from '../product-card/services/product.service';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  userRole=signal<string>('');

  constructor(private productService:ProductService,
              private cookieService:CookieService,
              private authService:AuthService,
              private router:Router
  ){
    this.userRole.set(this.cookieService.get('userRole'));
  }

  logout() {
    this.authService.logout().subscribe(_=>{
      this.router.navigate(['/auth/login']);
      sessionStorage.removeItem("loggedIn");
    });
  }
}
