import {Component, signal} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatInput, MatInputModule, MatLabel} from "@angular/material/input";
import {MatFormFieldModule} from '@angular/material/form-field';
import {ShipmentModel} from '../../shared/domain/shipment.model';
import {Settings} from 'node:http2';
import {SettingsService} from '../settings.service';
import {SettingsStoreService} from '../settings-store.service';
import {NotificationComponent} from '../../notifications/notification/notification.component';

@Component({
  selector: 'app-shipment',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NotificationComponent
  ],
  templateUrl: './shipment.component.html',
  styleUrl: './shipment.component.scss'
})
export class ShipmentComponent {
  shipment=signal(new ShipmentModel());
  message=signal('');

  constructor(private settingsService:SettingsService,private store:SettingsStoreService) {
    this.shipment=this.store.shipment;
  }

  firstNameChanged($event:string){
    this.shipment.set({...this.shipment(),firstName:$event});
  }

  lastNameChanged($event:string){
    this.shipment.set({...this.shipment(),lastName:$event});
  }

  countryChanged($event:string){
    this.shipment.set({...this.shipment(),country:$event});
  }

  provinceChanged($event:string){
    this.shipment.set({...this.shipment(),province:$event});
  }

  townChanged($event:string){
    this.shipment.set({...this.shipment(),town:$event});
  }

  addressLine1Changed($event:string){
    this.shipment.set({...this.shipment(),addressLine1:$event});
  }

  addressLine2Changed($event:string){
    this.shipment.set({...this.shipment(),addressLine2:$event});
  }

  postalCodeChanged($event:string){
    this.shipment.set({...this.shipment(),postalCode:$event});
  }

  phoneNumberChanged($event:string){
    this.shipment.set({...this.shipment(),phoneNumber:$event});
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.settingsService.saveShipment(this.shipment()).subscribe(res=>this.message.set(res));
    }
  }

}
