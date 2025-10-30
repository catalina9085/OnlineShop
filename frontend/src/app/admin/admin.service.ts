import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategoryModel} from '../shared/domain/category.model';
import {ProductModel} from '../shared/domain/product.model';
import {OverviewModel} from './domain/overview.model';
import {RevenueModel} from './domain/revenue.model';
import {OrderModel} from '../shared/domain/order.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  getCategories(){
    return this.http.get<CategoryModel[]>("http://localhost:8080/user/products/categories");
  }

  addProduct(formData:FormData){
    return this.http.post<ProductModel>("http://localhost:8080/admin/products",formData);
  }

  getProducts(){
    return this.http.get<ProductModel[]>("http://localhost:8080/admin/products");
  }

  deleteProduct(productId:number){
    return this.http.delete<string>(`http://localhost:8080/admin/products/${productId}`,{responseType:'text' as 'json'});
  }

  editProduct(formData:FormData,productId:number|undefined){
    return this.http.put<ProductModel>(`http://localhost:8080/admin/products/${productId}`,formData);
  }

  getProduct(productId:number){
    return this.http.get<ProductModel>(`http://localhost:8080/admin/products/${productId}`);
  }

  deleteImage(imageId:number,productId:number|undefined){
    return this.http.delete<string>(`http://localhost:8080/admin/images/${productId}/${imageId}`,{responseType:'text' as 'json'});
  }

  deleteReview(reviewId:number){
    return this.http.delete<string>(`http://localhost:8080/admin/reviews/${reviewId}`,{responseType:'text' as 'json'});
  }

  getOverview(){
    return this.http.get<OverviewModel>('http://localhost:8080/admin/overview');
  }

  getOrders(){
    return this.http.get<OrderModel[]>('http://localhost:8080/admin/orders');
  }

}
