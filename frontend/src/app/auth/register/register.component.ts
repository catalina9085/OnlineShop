import {Component, signal} from '@angular/core';
import {RegisterRequestModel} from '../domain/register-request.model';
import {AuthService} from '../auth.service';
import {FormsModule, NgForm} from '@angular/forms';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerRequest=signal(new RegisterRequestModel());
  errorMessage=signal('');

  constructor(private authService:AuthService,private router:Router){}


  onSubmit(registerForm: NgForm) {
    if(registerForm.valid){
      this.authService.register(this.registerRequest()).subscribe({
          next: res => this.router.navigate(['/auth/login', {message: 'Registration complete! You can now log in to your account.'}]),
          error: err => this.errorMessage.set(err.error)
        });
    }
  }

  emailChanged($event: any) {
    this.registerRequest.set({...this.registerRequest(),email:$event});
  }

  usernameChanged($event: any) {
    this.registerRequest.set({...this.registerRequest(),username:$event});
  }

  passwordChanged($event: any) {
    this.registerRequest.set({...this.registerRequest(),password:$event});
  }

  confirmPasswordChanged($event: any) {
    this.registerRequest.set({...this.registerRequest(),confirmPassword:$event});
  }

}
