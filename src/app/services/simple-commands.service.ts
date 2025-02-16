import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessagesService} from './messages.service';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';


@Injectable()
export class SimpleCommandsService {

  constructor(private http: HttpClient) { }


  regenerateStats(): Observable<string> {
    return this.http.put<string>(`http://localhost:8090/utils/stats` , {});
  }

  regenerateSpellCheck(): Observable<string> {
    return this.http.put<string>('http://localhost:8090/spellcheck/regenerate', {});
  }
}
