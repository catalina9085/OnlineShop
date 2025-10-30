import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WishlistModel} from '../domain/wishlist.model';
import {ProductModel} from '../../shared/domain/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http:HttpClient) { }

  getWishlist(){
    return this.http.get<ProductModel[]>("http://localhost:8080/user/wishList");
  }

  removeFromWishList(id:number){
    return this.http.delete<string>(`http://localhost:8080/user/wishList/${id}`,{responseType:'text' as 'json'});
  }

  addToCart(productId:number){
    return this.http.post<string>(`http://localhost:8080/user/cart/${productId}`,null,{responseType:'text' as 'json'});
  }
}
