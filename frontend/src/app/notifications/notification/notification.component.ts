import {Component, effect} from '@angular/core';
import {NotificationsService} from '../notifications.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [
    NgClass
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  message: string | null = null;

  constructor(private notifService: NotificationsService) {
    effect(()=>{
      this.message = notifService.latestMessage();
      console.log(this.message);// reactive signal
    });
  }

  hide() {
    const notifEl = document.querySelector('.notif-container');
    if (notifEl) {
      notifEl.classList.add('hide'); // pornește animația slide-out
      setTimeout(() => {
        this.notifService.reset(); // după 500ms dispare din DOM
      }, 500);
    }
  }
}
