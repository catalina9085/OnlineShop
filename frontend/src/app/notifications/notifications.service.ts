import {Injectable, signal} from '@angular/core';
import {Client, IMessage, Message} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {BehaviorSubject} from 'rxjs';
import {ProductService} from '../product/services/product.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private client: Client;
  public latestMessage = signal<string|null>(null); // reactive signal pentru notificări
  userId=signal<number>(-1);

  constructor(private http:HttpClient) {
    this.http.get<number>("http://localhost:8080/user/products/userId",{responseType:'text' as 'json',withCredentials:true}).subscribe(id=>this.userId.set(id));
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/chat', // backend-ul tău WebSocket
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket server');

      // subscribe la topic global de test
      this.client.subscribe('/topic/offers', (msg: IMessage) => {
        console.log('Message received:', msg.body);
        this.latestMessage.set(msg.body); // actualizează signal
      });
      this.client.subscribe('/topic/newArrivals', (msg: IMessage) => {
        console.log('Message received:', msg.body);
        this.latestMessage.set(msg.body); // actualizează signal
      });
      this.client.subscribe(`/topic/orderStatus/${this.userId()}`, (msg: IMessage) => {
        console.log('Message received:', msg.body);
        this.latestMessage.set(msg.body); // actualizează signal
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Details: ' + frame.body);
    };
    this.client.onWebSocketError = (event) => {
      console.error('WebSocket error', event);
    };
    this.client.activate(); // pornește conexiunea
  }

  reset(){
    this.latestMessage.set(null);
  }
}
