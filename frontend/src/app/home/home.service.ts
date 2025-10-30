import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductModel} from '../shared/domain/product.model';
import {CategoryModel} from '../shared/domain/category.model';
import {FilterModel} from '../shared/domain/filter.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http:HttpClient) { }

  getProducts(filter:FilterModel|null){
    if(!filter)
      return this.http.get<ProductModel[]>('http://localhost:8080/user/products');
    else
      return this.http.post<ProductModel[]>('http://localhost:8080/user/products/filter',filter);

  }
  getCategories(){
    return this.http.get<CategoryModel[]>('http://localhost:8080/user/products/categories');
  }

}
