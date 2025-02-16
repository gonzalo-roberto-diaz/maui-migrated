import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  private errorsSubject = new BehaviorSubject<string[]>([]);

  private messagesSubject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]> = this.errorsSubject.asObservable();


  messages$: Observable<string[]> = this.messagesSubject.asObservable();


  showErrors(...errors: string[]) {
    this.errorsSubject.next(errors);
  }

  showMessages(...messages: string[]) {
    this.messagesSubject.next(messages);
  }

  clear() {
    this.messagesSubject.next([]);
    this.errorsSubject.next([]);
  }

}
