import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  addToWishlist(id:number){
    this.http.post<string>(`http://localhost:8080/user/wishList/${id}`,null,{withCredentials:true,responseType:'text' as 'json'}).subscribe();
  }

  removeFromWishlist(id:number){
    this.http.delete<string>(`http://localhost:8080/user/wishList/${id}`,{withCredentials:true,responseType:'text' as 'json'}).subscribe();
  }

  existsInWishlist(id:number){
   return this.http.get<string>(`http://localhost:8080/user/wishList/${id}`,{withCredentials:true,responseType:'text' as 'json'});
  }
}
