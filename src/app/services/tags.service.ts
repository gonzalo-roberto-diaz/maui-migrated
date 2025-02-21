import { Injectable } from '@angular/core';
import {TagView} from '../models/TagView';
import {HttpClient} from '@angular/common/http';
import {TagsPerSongView} from '../models/TagsPerSongView';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessagesService} from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient, private messagesService: MessagesService) { }

  selectBySubstring(substring: string): Observable<TagView[]> {
    return this.http.get<TagView[]>( `http://localhost:8090/tag/substring/${substring}`, {});
  }

  getTpsPerSong(urlKey: string): Observable<TagsPerSongView[]> {
    return this.http.get<TagsPerSongView[]>('http://localhost:8090/tag/links_per_song/' + urlKey, {});
  }

  getTpsPerTag(tagKey: string): Observable<TagsPerSongView[]> {
    return this.http.get<TagsPerSongView[]>('http://localhost:8090/tag/links_per_tag/' + tagKey, {});
  }

  deleteTpsLink(urlKey: string, tagKey: string, tagType: string): Observable<string> {
    return this.http.delete<string>('http://localhost:8090/tag/link/' + urlKey + '/' + tagKey + '/' + tagType, {});
  }

  createTpsLink(urlKey: string, tagKey: string, tagType: string): Observable<string> {
    return this.http.put<string>('http://localhost:8090/tag/link/' + urlKey + '/' + tagKey + '/' + tagType, {});
  }

  insert(tag: TagView): Observable<string> {

    if (tag.same_as === '') {
      tag.same_as = null;
    }

    return this.http.post<string>('http://localhost:8090/tag', tag)
      .pipe(
        catchError(error => {
          const message = 'Error inserting tag';
          this.messagesService.showErrors(message, error.error.message);
          return throwError(error);
        })
      );
  }

  update(tag: TagView): Observable<string> {

    if (tag.same_as === '') {
      tag.same_as = null;
    }

    return this.http.put<string>('http://localhost:8090/tag', tag)
      .pipe(
        catchError(error => {
          const message = 'Error updating tag';
          this.messagesService.showErrors(message, error.error.message);
          return throwError(error);
        })
      );
  }

  generateJsonDl(tagKey: string): Observable<string> {
    return this.http.put<string>(`http://localhost:8090/sep/tag/regenerate_one/${tagKey}` , {})
      .pipe(
        catchError(error => {
          const message = 'Error regenerating tag for tagKye=' + tagKey;
          this.messagesService.showErrors(message, error.error.message);
          return throwError(error);
        })
      );
  }


  delete(tagKey: string): Observable<string> {
    return this.http.delete<string>('http://localhost:8090/tag/' + tagKey, {});
  }

}
