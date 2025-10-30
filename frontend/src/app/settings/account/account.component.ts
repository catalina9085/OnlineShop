import {Component, signal} from '@angular/core';
import {ChangePasswordModel} from '../domain/change-password.model';
import {FormsModule, NgForm} from '@angular/forms';
import {SettingsService} from '../settings.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-account',
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, MatButton, NotificationComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  changePasswordRequest=signal<ChangePasswordModel>(new ChangePasswordModel());
  message=signal<string>('');
  showConfirmDelete=signal<boolean>(false);

  constructor(private settingsService:SettingsService,private router:Router){}

  currentPasswordChanged(currentPassword:string){
    this.changePasswordRequest.set({...this.changePasswordRequest(),currentPassword:currentPassword});
  }

  newPasswordChanged(newPassword:string){
    this.changePasswordRequest.set({...this.changePasswordRequest(),newPassword:newPassword});
  }

  confirmPasswordChanged(confirmPassword:string){
    this.changePasswordRequest.set({...this.changePasswordRequest(),confirmPassword:confirmPassword});
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.settingsService.changePassword(this.changePasswordRequest()).subscribe(
        res=>this.message.set(res),
        err=>this.message.set(err.error)
      );
      form.resetForm();
    }
  }

  deleteAccount(){
    this.showConfirmDelete.set(true);
    console.log("yes");
  }

  confirmDelete(){
    this.settingsService.deleteAccount().subscribe(_=>{
      this.router.navigate(['/auth/login',{message:'Your account has been successfully deleted!'}])
    })
  }
}
