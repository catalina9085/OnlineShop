import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductModel} from '../../shared/domain/product.model';
import {CartItemModel} from '../domain/cartItem.model';
import {OrderModel} from '../../shared/domain/order.model';
import {ShipmentModel} from '../../shared/domain/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http:HttpClient) { }

  getItems(){
    return this.http.get<CartItemModel[]>("http://localhost:8080/user/cart");
  }

  updateQuantity(itemId:number,quantity:number){
    return this.http.put<string>(`http://localhost:8080/user/cart/${itemId}`,quantity,{responseType:'text' as 'json'});
  }

  getOrder(id:number){
    return this.http.get<OrderModel>(`http://localhost:8080/user/orders/${id}`);
  }

  getShipment(){
    return this.http.get<ShipmentModel>("http://localhost:8080/user/cart/shipment");
  }

  saveShipment(shipment:ShipmentModel){
    return this.http.post<string>("http://localhost:8080/user/settings/shipment",shipment,{responseType:'text' as 'json'});
  }

  createOrder(){
    return this.http.post<number>("http://localhost:8080/user/orders",null,{responseType:'text' as 'json',withCredentials:true});
  }

  placeOrder(orderId:number){
    return this.http.post<string>(`http://localhost:8080/user/orders/${orderId}`,null,{responseType:'text' as 'json'});
  }

  deleteFromCart(itemId:number){
    return this.http.delete<string>(`http://localhost:8080/user/cart/${itemId}`,{responseType:'text' as 'json'});
  }

  paymentSuccessful(orderId:number){
    return this.http.post<string>(`http://localhost:8080/user/orders/${orderId}/mark-paid`,null,{responseType:'text' as 'json'})
  }

  paymentCanceled(orderId:number){
    return this.http.post<string>(`http://localhost:8080/user/orders/${orderId}/payment-cancelled`,null,{responseType:'text' as 'json'})
  }
}
