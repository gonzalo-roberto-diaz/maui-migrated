import { Component, OnInit } from '@angular/core';
import {mergeWith, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MessagesService} from '../services/messages.service';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  showMessages = false;

  showErrors = false;

  errors$: Observable<string[]> = new Observable<string[]>();

  messages$: Observable<string[]> = new Observable<string[]>();


  constructor(public messagesService: MessagesService) {

    console.log('Created messages component');

  }

  ngOnInit() {
    this.errors$ = this.messagesService.errors$
      .pipe(
        tap(() => this.showErrors = true)
      );

    this.messages$ = this.messagesService.messages$
      .pipe(
        tap(() => this.showMessages = true)
      );
  }


  onClose() {
    this.showMessages = false;
    this.showErrors = false;
    this.messagesService.clear();
  }

}
