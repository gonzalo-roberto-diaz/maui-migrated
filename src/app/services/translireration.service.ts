import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, switchMap} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslirerationService {

  constructor(private http: HttpClient) {
  }

  transliterateBasedOnRules(hindiText: string): Observable<string> {
    return this.http.get<{ latin: string }>( 'http://localhost:8090/utils/transliterate',  {params: { hindiText: hindiText}})
      .pipe(
        map( result => result['latin'])
      );
  }

  transliterateFromDB(hindiText: string): Observable<string> {
    return this.http.get<{ latin: string }>( 'http://localhost:8090/utils/latinFromHindi',  {params: { hindiText: hindiText}})
      .pipe(
        map( result => result['latin'])
      );
  }


  latinFromHindi(hindiWord: string): Observable<string> {
    return this.transliterateFromDB(hindiWord).pipe(
      switchMap(response => {
        // If DB transliteration returns "nothing ...", fall back to generic
        if (response.includes("nothing for")) {
          return this.transliterateBasedOnRules(hindiWord);
        }
        return of(response); // Otherwise, return DB result
      }),
      catchError(() => this.transliterateBasedOnRules(hindiWord)) // Fallback if DB request errors out
    );
  }

  hindiToUrdu(hindiWord: string) {
    return this.http.get<{ urdu: string }>( 'http://localhost:8090/utils/urduFromHindi',  {params: {hindiText: hindiWord}})
      .pipe(
        map( result => result['urdu'])
      );
  }

}
