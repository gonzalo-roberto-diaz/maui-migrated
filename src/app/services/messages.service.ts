import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  private errorsSubject = new BehaviorSubject<string[]>([]);

  private messagesSubject = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]> = this.errorsSubject.asObservable()
    .pipe(
      filter(item => item && item.length > 0)
    );

  messages$: Observable<string[]> = this.messagesSubject.asObservable()
    .pipe(
      filter(item => item && item.length > 0)
    );

  showErrors(...errors: string[]) {
    this.errorsSubject.next(errors);
  }

  showMessages(...messages: string[]) {
    this.messagesSubject.next(messages);
  }

}
