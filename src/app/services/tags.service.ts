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

  async selectBySubstring(substring: string): Promise<TagView[]> {
    return this.http.get<TagView[]>( `http://localhost:8090/tag/substring/${substring}`, {})
      .toPromise();
  }

  async getTpsPerSong(urlKey: string): Promise<TagsPerSongView[]> {
    return this.http.get<TagsPerSongView[]>('http://localhost:8090/tag/links_per_song/' + urlKey, {})
      .toPromise();
  }

  async getTpsPerTag(tagKey: string): Promise<TagsPerSongView[]> {
    return this.http.get<TagsPerSongView[]>('http://localhost:8090/tag/links_per_tag/' + tagKey, {})
      .toPromise();
  }

  async deleteTpsLink(urlKey: string, tagKey: string, tagType: string): Promise<string> {
    return this.http.delete<string>('http://localhost:8090/tag/link/' + urlKey + '/' + tagKey + '/' + tagType, {})
      .toPromise();
  }

  async createTpsLink(urlKey: string, tagKey: string, tagType: string): Promise<string> {
    return this.http.put<string>('http://localhost:8090/tag/link/' + urlKey + '/' + tagKey + '/' + tagType, {})
      .toPromise();
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


  async delete(tagKey: string): Promise<string> {
    return this.http.delete<string>('http://localhost:8090/tag/' + tagKey, {})
      .toPromise();
  }

}
