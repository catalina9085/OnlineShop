import {Component, input} from '@angular/core';
import {MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {SidenavComponent} from "../sidenav/sidenav.component";
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-header',
    imports: [
        MatIconModule,
        MatIconButton,
        RouterLink,
        SidenavComponent
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  message=input<string>('');
}
