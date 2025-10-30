import {Component,signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from '../auth.service';
import {Router, RouterLinkActive} from '@angular/router';
import {ResetPasswordModel} from '../domain/reset-password.model';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  email=signal('');
  errorMessage=signal('');
  message=signal('');
  showForm=signal(false);
  resetPasswordRequest=signal(new ResetPasswordModel());

  constructor(private authService:AuthService,private router:Router){
    console.log(this.showForm())
  }

  emailChanged($event: string) {
    this.email.set($event);
    this.resetPasswordRequest.set({...this.resetPasswordRequest(),email:$event});
  }

  newPasswordChanged($event: string) {
    this.resetPasswordRequest.set({...this.resetPasswordRequest(),newPassword:$event});
  }

  confirmPasswordChanged($event: string) {
    this.resetPasswordRequest.set({...this.resetPasswordRequest(),confirmPassword:$event});
  }

  codeChanged($event: string) {
    this.resetPasswordRequest.set({...this.resetPasswordRequest(),code:$event});
  }

  onEmailSubmit(loginForm:NgForm){
    if(loginForm.valid){
      this.authService.sendEmail(this.email()).subscribe({
        next:res=>this.showForm.set(true),
        error: err=>this.errorMessage.set(err.error)
      });
    }
  }

  onPasswordSubmit(passwordForm:NgForm){
    if(passwordForm.valid){
        this.authService.resetPassword(this.resetPasswordRequest()).subscribe({
          next:res=>{
            this.router.navigate(['/auth/login',{message:'Your password has been successfully changed.You can now log in!'}])
            console.log("changed");
          },
          error:err=>this.errorMessage.set(err.error)
        });
    }
  }

  resendEmail(){
    this.authService.sendEmail(this.email()).subscribe({
      next:res=>this.message.set("We sent a new email!")
    });
  }
}
