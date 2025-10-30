import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageModel} from '../domain/message.model';
import {map, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) { }

  getResponse(question:string){
    return this.http.get<string>(`http://localhost:8080/user/ai/ask?message=${question}`,{responseType:'text' as 'json'}).pipe(
      map(response=>{
        console.log("Response:",response);
        return new MessageModel(response,"chat");
      })
    );
  }
}

