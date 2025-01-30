import {Injectable} from '@angular/core';
import {InflectionTableModel} from '../models/InflectionTableModel';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {InflectionTableItem} from '../models/InflectionTableItem';
import {catchError, shareReplay} from 'rxjs/operators';
import {MessagesService} from './messages.service';
import {InflectedItem} from '../models/InflectedItem';

@Injectable({
  providedIn: 'root'
})
export class InflectionTableService {

  constructor(private httpClient: HttpClient, private messagesService: MessagesService) {
  }


  getSong(selectorItemKey: string): Observable<InflectionTableItem[]> {
    return this.httpClient.get<InflectionTableItem[]>(`http://localhost:8090/inflection-table/song/${selectorItemKey}`, {})
      .pipe(
        catchError(err => {
          this.messagesService.showErrors('error getting song: ', err.message);
          return throwError(err);
        })
      );
  }

  // tslint:disable-next-line:ban-types
  putSong(map: Object[], selectorItemKey: string): Observable<any> {
    // tslint:disable-next-line:ban-types
    return this.httpClient.put<Map<string, Object>>(`http://localhost:8090/inflection-table/song/${selectorItemKey}`, map, {})
      .pipe(
        catchError(err => {
          this.messagesService.showErrors('error storing song: ', err.message);
          return throwError(err);
        })
      );
  }

  // tslint:disable-next-line:ban-types
  putLine(selectorItemKey: string, position: number, hindi: string, index: number): Observable<any> {
    // tslint:disable-next-line:ban-types
    return this.httpClient.put<Map<string, Object>>(`http://localhost:8090/inflection-table/song/${selectorItemKey}/position/${position}`,
      {},
      {
        params: {
          hindi,
          index: index.toString()
        }
      }
    ).pipe(
        shareReplay(),
        catchError(err => {
          this.messagesService.showErrors('error storing song: ', err.message);
          return throwError(err);
        })
      );
  }


  updateInflected(urlKey: string, position: number,  hindi: string, index: number): void {
    alert ('updating inflected item with hindi=' + hindi + ' at position ' + position);
  }


  createTable(fileName: string): Observable<string> {
    return this.httpClient.put<string>('http://localhost:8090/songs/createpreliminar',  {}, {params: {fileName}} );


    // .toPromise()
    //   .then(() => this.model.message = 'Table created!')
    //   .catch(reason => this.model.message = reason.message);

  }

  resequenceTable(fileName: string): Observable<string> {
    return this.httpClient.put<string>('http://localhost:8090/songs/resequence', {}, {params: {songFile: fileName}});
  }



  insertMaster(model: InflectionTableModel, hindi: string, indexes: number[]): InflectionTableModel {
    console.log('received model =' + model);

    const lastIndex = indexes[indexes.length - 1];

    for (let i = 0; i < model.map.length; i++) {
      const item = model.map[i];

      // @ts-ignore
      if (item.tableItemType === 'INFLECTED_ENTRY') {
        // @ts-ignore
        if (item.position === lastIndex) {
          const itemToInsert = new InflectionTableItem();
          // @ts-ignore
          itemToInsert.index = 0;
          // @ts-ignore
          itemToInsert.indexes = indexes;
          // @ts-ignore
          itemToInsert.position = i + 1;
          // @ts-ignore
          itemToInsert.tableItemType = 'MASTER_ENTRY';
          // @ts-ignore
          itemToInsert.text = hindi;
          model.map.splice(i + 1, 0, itemToInsert);
          break;
        }
      }
      // console.log(model.map[i]);
    }

    // re-sequence Master entries
    let masterIndex = -1;
    model.map.forEach( item => {
      // @ts-ignore
      if (item.tableItemType === 'MASTER_ENTRY') {
        // @ts-ignore
        item.position = masterIndex;
        masterIndex--;
      }
    });

    return model;
  }
}
