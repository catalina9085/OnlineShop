import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductModel} from '../../shared/domain/product.model';
import {ReviewRequestModel} from '../domain/review-request.model';
import {ReviewModel} from '../../shared/domain/review.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  getProduct(productId:number){
    return this.http.get<{product:ProductModel,recommended:ProductModel[]}>(`http://localhost:8080/user/products/${productId}`);
  }

  saveReview(review:ReviewRequestModel){
    return this.http.post<string>(`http://localhost:8080/user/products/reviews`,review,{responseType:'text' as 'json'});
  }

  getReviews(productId:number){
    return this.http.get<ReviewModel[]>(`http://localhost:8080/user/products/reviews/${productId}`);
  }

  addToCart(productId:number){
    return this.http.post<string>(`http://localhost:8080/user/cart/${productId}`,null,{responseType:'text' as 'json'});
  }

  addToWishList(productId:number){
    return this.http.post<string>(`http://localhost:8080/user/wishList/${productId}`,null,{responseType:'text' as 'json'});
  }
}
