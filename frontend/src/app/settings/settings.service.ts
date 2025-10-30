import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotificationsModel} from './domain/notifications.model';
import {OrderModel} from '../shared/domain/order.model';
import {ChangePasswordModel} from './domain/change-password.model';
import {ShipmentModel} from '../shared/domain/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http:HttpClient) { }

  getNotificationsPreferences(){
    return this.http.get<NotificationsModel>("http://localhost:8080/user/settings/notifications");
  }

  saveNotificationsPreferences(preferences:NotificationsModel){
    return this.http.post<string>("http://localhost:8080/user/settings/notifications",preferences,{responseType:'text' as 'json'});
  }

  getOrders(){
    return this.http.get<OrderModel[]>("http://localhost:8080/user/orders");
  }

  removeOrderFromHistory(id:number){
    return this.http.delete<string>(`http://localhost:8080/user/cart/orders/${id}`,{responseType:'text' as 'json'});
  }

  changePassword(changePasswordRequest:ChangePasswordModel){
    return this.http.post<string>("http://localhost:8080/user/settings/changePassword",changePasswordRequest,{responseType:'text' as 'json'});
  }

  deleteAccount(){
    return this.http.delete<string>("http://localhost:8080/user/settings/account",{responseType:'text' as 'json'});
  }

  getShipment(){
    return this.http.get<ShipmentModel>("http://localhost:8080/user/cart/shipment");
  }

  saveShipment(shipment:ShipmentModel){
    return this.http.post<string>("http://localhost:8080/user/settings/shipment",shipment,{responseType:'text' as 'json'});
  }
}
