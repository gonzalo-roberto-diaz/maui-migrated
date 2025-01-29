import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CanonicalWrapper} from '../models/CanonicalWrapper';
import {SimpleEntry} from '../models/SimpleEntry';
import {Inflected} from '../models/Inflected';
import {InflectedView} from '../models/InflectedView';
import {PartOfSpeech} from '../models/PartOfSpeech';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators'
import {DictionaryUpdateView} from "../dictionary/dictionary-update/DictionaryUpdateView";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  findHindi(hindi: string): Observable<SimpleEntry[]> {
    return this.http.get<Map<string, CanonicalWrapper>>(environment.javaHost + '/dictionaries/findInDictionaries', {params: {hindiWord: hindi}})
    .pipe(
      map(map => {
          const entries: SimpleEntry[] = [];
          const values = Object.values(map);
          values.forEach(wrapper => entries.push(this.transformDicionaryWrapper(wrapper)));
          return entries;
        })
     );
  }

  findMorphology(hindi: string): Observable<SimpleEntry[]> {
    return this.http.get<CanonicalWrapper[]>(environment.javaHost + '/morphology/suggestCanonicals', {params: {hindiWord: hindi}})
    .pipe(
      map(arr => {
        const entries: SimpleEntry[] = [];
        arr.forEach(wrapper => entries.push(this.transformDicionaryWrapper(wrapper)));
        return entries;
      })
    );
  }

  findMeaning(word: string, partOfSpeech: PartOfSpeech): Observable<SimpleEntry[]> {
    return this.http.get<CanonicalWrapper[]>(environment.javaHost + '/dictionaries/findByMeaning',
     {
       params: {
         word,
         part_of_speech: partOfSpeech.toString()
       }
     })
   .pipe(
     map((arr => {
       const entries: SimpleEntry[] = [];
        arr.forEach(wrapper => entries.push(this.transformDicionaryWrapper(wrapper)));
        return entries;
      })
    )
  );
  }

  findInflectedByWord(word: string): Observable<Inflected[]> {
    let entries: Inflected[] = [];
    return this.http.get<Inflected[]>(environment.javaHost + '/inflected/findByWordFlat', {params: {hindiWord: word}});
  }

  findByMasterDictionaryid(masterDictionaryId: number): Observable<Inflected[]> {
    let entries: Inflected[] = [];
    return this.http.get<Inflected[]>(environment.javaHost + '/inflected/findByMasterDictionaryId', {params: {masterDictionaryId: masterDictionaryId.toString()}});
  }

  deleteInflected(inflectedHindi: string, inflectedHindiIndex: number): Observable<void> {
    return this.http.delete<void>(environment.javaHost + `/inflected/delete/${inflectedHindi}/${inflectedHindiIndex}`);
  }

  findByMasterHindiSubstring(word: string): Observable<SimpleEntry[]> {
    return this.http.get<CanonicalWrapper[]>(environment.javaHost + '/dictionaries/findByMasterHindiSubstring', {params: {word}})
    .pipe(
      map(arr => {
        const entries: SimpleEntry[] = [];
        arr.forEach(wrapper => entries.push(this.transformDicionaryWrapper(wrapper)));
        return entries;
      })
    );
  }

  findByMasterUrduSubstring(word: string): Observable<SimpleEntry[]> {

    return this.http.get<CanonicalWrapper[]>(environment.javaHost + '/dictionaries/findByMasterUrduSubstring', {params: {word}})
      .pipe(
        map(arr => {
        const entries: SimpleEntry[] = [];
        arr.forEach(wrapper => entries.push(this.transformDicionaryWrapper(wrapper)));
        return entries;
      })
    );

  }

//   return this.http.post<string>('http://localhost:8090/tag', tag)
// .pipe(
//     catchError(error => {
//   const message = 'Error inserting tag';
//   this.messagesService.showErrors(message, error.error.message);
//   return throwError(error);
// })
// );

  updateInflected(keyInflectedHindi: string, keyInflectedHindiIndex: number, inflectedView: InflectedView): Observable<string> {
    return this.http.post<string>(environment.javaHost + `/inflected/update/${keyInflectedHindi}/${keyInflectedHindiIndex}`, inflectedView);
  }

  insertInflected(inflectedView: InflectedView, masterDictionaryId: number): Observable<string> {
    return this.http.post<string>(environment.javaHost + `/inflected/insert/${masterDictionaryId}`, inflectedView);
  }

  updateDictionary(dictionaryUpdateView: DictionaryUpdateView): Observable<string> {
    return this.http.post<string>(environment.javaHost + `/dictionaries/update`, dictionaryUpdateView);
  }

  transformDicionaryWrapper(wrapper: object): SimpleEntry {
    const result = new SimpleEntry();
    // @ts-ignore
    result.id = wrapper.entry.id;
    // @ts-ignore
    result.hindi = wrapper.entry.hindiWord;
    // @ts-ignore
    result.partOfSpeech = wrapper.entry.partOfSpeech;
    // @ts-ignore
    result.meaning = wrapper.entry.meaning;
    // @ts-ignore
    result.urdu = wrapper.entry.urduWord;
    // @ts-ignore
    result.latin = wrapper.entry.romanizedWord;
    // @ts-ignore
    result.dictionarySource = wrapper.dictionarySource;
    return result;
  }

  transformWrapper(wrapper: CanonicalWrapper): SimpleEntry {
    const result = new SimpleEntry();
    // @ts-ignore
    result.hindi = wrapper.dictionaryEntry.get('hindiWord');
    // @ts-ignore
    result.partOfSpeech = wrapper.dictionaryEntry.get('partOfSpeech');
    // @ts-ignore
    result.meaning = wrapper.dictionaryEntry.get('meaning');
    // @ts-ignore
    result.urdu = wrapper.dictionaryEntry.get('urduWord');
    // @ts-ignore
    result.latin = wrapper.dictionaryEntry.get('romanizedWord');
    result.dictionarySource = wrapper.dictionarySource;
    return result;
  }


}
