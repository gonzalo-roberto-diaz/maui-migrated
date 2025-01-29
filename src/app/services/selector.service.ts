import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SelectorItem} from '../models/SelectorItem';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SelectorsService {

  private allItems: SelectorItem[] = [];

  constructor(private http: HttpClient) {}

  retrieveAllItems(): Observable<SelectorItem[]> {
    return this.http.get<SelectorItem[]>('http://localhost:8090/selector/all', {});
  }

  selectByTitleSubstring(substring: string): SelectorItem[] {
    if (typeof(this.allItems) === 'undefined') {
      return [];
    } else {
      return this.allItems.filter(i => i.title.indexOf(substring) >= 0);
    }
  }
}
