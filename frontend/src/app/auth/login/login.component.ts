import {Component, effect, input, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {LoginRequestModel} from '../domain/login-request.model';
import {AuthService} from '../auth.service';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginRequest=signal<LoginRequestModel>(new LoginRequestModel());
  errorMessage=signal('');
  message=input('');

  constructor(private authService:AuthService,private router:Router){}

  emailChanged($event: string) {
    this.loginRequest.update(prev=>{
      return {...prev,username:$event}
    });
  }

  passwordChanged($event: string) {
    this.loginRequest.update(prev=>{
      return {...prev,password:$event}
    });
  }

  onSubmit(loginForm:NgForm){
    if(loginForm.valid){
        this.authService.login(this.loginRequest()).subscribe({
          next: res=>{
            //this.authService.isLoggedIn.set(true);
            sessionStorage.setItem('loggedIn', 'true')
            this.router.navigate(['/home']);
          },
          error:err=>this.errorMessage.set(err.error)
        });
    }
  }

}
