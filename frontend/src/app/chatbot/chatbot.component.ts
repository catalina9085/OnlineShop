import {Component, signal} from '@angular/core';
import {MessageModel} from './domain/message.model';
import {ChatService} from './services/chat.service';
import {MatCard} from '@angular/material/card';
import {NgClass} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatFormField} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-chatbot',
  imports: [
    MatCard,
    NgClass,
    MatFormField,
    MatInput,
    FormsModule,
    MatIcon
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {
  messages=signal<MessageModel[]>([]);
  newMessage=signal<MessageModel>(new MessageModel("",""));

  constructor(private chatService:ChatService){}

  askQuestion(){
    this.messages.set([...this.messages(),this.newMessage()]);
    this.chatService.getResponse(this.newMessage().message).subscribe(message=>{
      this.messages.set([...this.messages(),message]);
    })
  }

  newMessageChanged(message:string){
    this.newMessage.set({...this.newMessage(),"message":message});
  }
}
