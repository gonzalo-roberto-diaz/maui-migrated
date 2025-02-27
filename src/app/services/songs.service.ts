import { Injectable } from '@angular/core';
import {TagView} from '../models/TagView';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {TagsPerSongView} from '../models/TagsPerSongView';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessagesService} from './messages.service';
import {SongDB} from '../models/SongDB';
import {InputView} from '../models/InputView';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(private http: HttpClient, private messagesService: MessagesService) { }

  public findByBollySubstring(substring: string): Observable<SongDB[]> {
    return this.http.get<SongDB[]>( `http://localhost:8090/songs/find-by-bolly-substring`, {params: {bolly_substring: substring}});
  }

  public createSongAndTemplate(song: SongDB): Observable<void> {
    return  this.http.post<void>('http://localhost:8090/songs/createsongtemplate', song)
      .pipe(
        catchError(this.handleError) // Handle errors
      )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred.';
    if (error.status === 400) {
      errorMessage = error.error.message || 'Invalid input. Please check your data.';
    }
    return throwError(() => new Error(errorMessage));
  }

  public updateSong(song: SongDB): Observable<void> {
    return  this.http.put<void>('http://localhost:8090/songs/update', song)
      .pipe(
        catchError(this.handleError) // Handle errors
      )
  }

}
