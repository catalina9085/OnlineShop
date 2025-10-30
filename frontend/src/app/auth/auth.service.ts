import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginRequestModel} from './domain/login-request.model';
import {RegisterRequestModel} from './domain/register-request.model';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {ResetPasswordModel} from './domain/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn=signal(false);
  constructor(private http:HttpClient) { }

  login(loginRequest:LoginRequestModel){
    let form=new FormData();
    form.append("username",loginRequest.username);
    form.append("password",loginRequest.password);
    return this.http.post<string>("http://localhost:8080/auth/login",form,{responseType:'text' as 'json'});
  }

  register(registerRequest:RegisterRequestModel){
    return this.http.post<string>("http://localhost:8080/auth/register",registerRequest,{responseType:'text' as 'json'});
  }

  sendEmail(email:string){
    return this.http.post<string>(`http://localhost:8080/auth/resetPassword`,{email:email},{responseType:'text' as 'json'});
  }

  resetPassword(resetPasswordRequest:ResetPasswordModel){
    return this.http.post<string>(`http://localhost:8080/auth/resetPassword/request`,resetPasswordRequest,{responseType:'text' as 'json'});
  }

  logout(){
    return this.http.post('http://localhost:8080/logout',{},{responseType:'text' as 'json'});
  }
}
