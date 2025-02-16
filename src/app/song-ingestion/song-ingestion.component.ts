import {Component, OnDestroy, OnInit} from '@angular/core';
import {InputView} from '../models/InputView';
import {SongIngestionModel} from '../models/SongIngestionModel';
import {HttpClient} from '@angular/common/http';
import {GlobalsService} from '../services/globals.service';
import {SelectorsService} from '../services/selector.service';
import {SelectorItem} from '../models/SelectorItem';
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from 'rxjs';
import {catchError, map, startWith, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from '@angular/material/input';
import {MessagesComponent} from '../messages/messages.component';
import {MessagesService} from '../services/messages.service';
import {SelectorItemType} from '../models/SelectorItemType';

@Component({
  selector: 'app-song-ingestion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatLabel, MatFormField, MatInput, MessagesComponent],
  templateUrl: './song-ingestion.component.html',
  styleUrls: ['./song-ingestion.component.scss']
})
export class SongIngestionComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  public model = new SongIngestionModel();
  options: SelectorItem[] = [];
  filteredOptions$ = new Observable<SelectorItem[]>();

  //a subject to be notified every time we want to change the song search string
  private searchTerms = new Subject<string>();


  constructor(private httpClient: HttpClient, private globals: GlobalsService, private selectorService: SelectorsService, private messagesService: MessagesService) {
    selectorService.retrieveAllItems().subscribe(result => this.options = result);
  }

  ngOnInit() {
    this.model = this.globals.songIngestionModel;
    this.filteredOptions$ = this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => this.fetchOptions(query))
      );
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

  ngOnDestroy(): void {
    this.globals.songIngestionModel = this.model;

  }

  search(query: string): void {
    this.searchTerms.next(query);
  }


  displayFn(user: SelectorItem | null): string {
    return user?.key ?? ''; // Uses optional chaining (?.) and nullish coalescing (??)
  }

  filter(val: string): SelectorItem[] {
    return this.options.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  onOptionSelected(item: SelectorItem): void {
    this.model.selectedItem = item;
    this.model.searchQuery = item.key;
  }

  resetForm(): void {
    this.model = new SongIngestionModel();
    this.messagesService.clear();
  }

  deductFileName(): string {
    let key = this.model.selectedItem.key;
    key = key + '.txt';
    return key;
  }

  ingestSong(): void {
    this.messagesService.clear();
    const fileName = this.deductFileName();
    this.httpClient.put<InputView>(`http://localhost:8090/songs/ingest/${fileName}/${this.model.selectedItem.key}`, {}).pipe(
      tap(
        () => this.messagesService.showMessages("The song's structure has been created successfully"),
      ),
      catchError(err => {
        this.messagesService.showErrors(`There was an error ingesting: ${err.error}`);
        return of(new InputView());
      })
    ).subscribe();
  }

  indexSong(): void {
    this.messagesService.clear();
    const fileName = this.deductFileName();
    this.httpClient.put<InputView>(`http://localhost:8090/songs/index_words/${fileName}/${this.model.selectedItem.key}`, {}).pipe(
      tap(
        () => this.messagesService.showMessages("The song's tokens have been indexed successfully"),
      ),
      catchError(err => {
          this.messagesService.showErrors(`There was an error indexing: ${err.error}`);
          return of(new InputView());
        })
    ).subscribe();
  }



}
