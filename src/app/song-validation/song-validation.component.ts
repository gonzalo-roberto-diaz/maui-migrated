import {Component, OnDestroy, OnInit} from '@angular/core';
import {SongValidationModel} from '../models/SongValidationModel';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalsService} from '../services/globals.service';
import {SelectorItem} from '../models/SelectorItem';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap} from 'rxjs';
import {SelectorsService} from '../services/selector.service';
import {catchError, map, tap} from 'rxjs/operators';
import {MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {SelectorItemType} from '../models/SelectorItemType';

@Component({
  selector: 'app-song-validation',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInput],
  templateUrl: './song-validation.component.html',
  styleUrls: ['./song-validation.component.scss']
})
export class SongValidationComponent implements OnInit, OnDestroy {

  public model = new SongValidationModel();

  //the array of SelectorItems to show in the dropdown, representing songs whose key fields  contain the searchQuery substring
  filteredOptions: Observable<SelectorItem[]> = new Observable<SelectorItem[]>()

  //a subject to be notified every time we want to change the song search string
  private searchTerms = new Subject<string>();


  constructor(private httpClient: HttpClient, private globals: GlobalsService, private selectorService: SelectorsService) {
  }

  /**
   * a command coming from the UI indicating that it is time to change the substring we use for querying songs
   * @param query
   */
  search(query: string): void {
    this.searchTerms.next(query);
  }

  /**
   * the function that goes outside the component in order to retrieve information
   * (the underlying service is clumsilu cached and can be inproved)
   * @param query
   * @private
   */
  private fetchOptions(query: string): Observable<SelectorItem[]> {
    return this.selectorService.retrieveAllItems().pipe(
        map( arr => arr.filter(item => item.key.indexOf(query) > -1  && item.type === SelectorItemType.Song ))
    );
  }

  onOptionSelected(item: SelectorItem): void {
    this.model.selectedItem = item;
    this.model.searchQuery = item.key;
  }

  ngOnInit() {
    this.model = this.globals.songValidationModel;
    this.filteredOptions = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.fetchOptions(query))
    );
  }

  ngOnDestroy(): void {
    this.globals.songValidationModel = this.model;
  }



  deductFileName() {
    if (!this.model.selectedItem) {
      this.model.messages = ['No selected URL!'];
      return null;
    } else {
      let key = this.model.selectedItem.key;
      key = key + '.txt';
      return key;
    }
  }

  validateSong() {
    const fileName = this.deductFileName();
    this.model.messages = [];
    this.httpClient.put<string[]>( `http://localhost:8090/songs/validation/${fileName}`,  {} ).pipe(
      tap((result: string[]) => {
        if (result.length === 0) {
          this.model.messages.push('Success!');
        } else {
          this.model.messages = result;
        }
      }),
      catchError((err: HttpErrorResponse) => this.model.messages = err.error)
    ).subscribe();
  }

  replaceNuktas() {
    const fileName = this.deductFileName();
    this.model.messages = [];
    this.httpClient.put<string>(`http://localhost:8090/songs/replace_nuktas/${fileName}`,  {} ).pipe(
      tap(result => {
          // @ts-ignore
          this.model.messages.push(result.message);
        }
      ),
      catchError((err: HttpErrorResponse) => this.model.messages = err.error)
    ).subscribe();
  }

  applyCorrector() {
    const fileName = this.deductFileName();
    this.model.messages = [];
    this.httpClient.put<string>(`http://localhost:8090/songs/apply_corrector/${fileName}`,  {}, ).pipe(
      tap(result => {
          // @ts-ignore
          this.model.messages.push(result.message);
        }
      ),
      catchError((err: HttpErrorResponse) => this.model.messages = err.error)
    ).subscribe();
  }

}
