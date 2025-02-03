import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessagesService} from './messages.service';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SimpleCommandsService {

  constructor(private http: HttpClient, private messagesService: MessagesService) { }


  regenerateStats(): Observable<string> {
    return this.http.put<string>(`http://localhost:8090/utils/stats` , {})
      .pipe(
        tap( () => this.messagesService.showMessages('Spell check regenerated!')),
        catchError(error => {
          const message = 'Error regenerating stats';
          this.messagesService.showErrors(message, error.error.message);
          return throwError(error);
        })
      );
  }

  regenerateSpellCheck(): Observable<string> {
    return this.http.put<string>('http://localhost:8090/spellcheck/regenerate', {})
      .pipe(
        tap(() => this.messagesService.showMessages('Spell check regenerated!')),
        catchError(error => {
          this.messagesService = error.error;
          return throwError(error);
        })
      );
  }
}
