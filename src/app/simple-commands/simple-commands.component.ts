import { Component, OnInit } from '@angular/core';
import {InputView} from '../models/InputView';
import {HttpClient} from '@angular/common/http';
import {SongIngestionModel} from '../models/SongIngestionModel';
import {SelectorItem} from '../models/SelectorItem';
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, throwError} from 'rxjs';
import {SelectorsService} from '../services/selector.service';
import {catchError, map, startWith, tap} from 'rxjs/operators';
import {ApiResponse} from "../models/ApiResponse";
import {SimpleCommandsService} from "../services/simple-commands.service";
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from "@angular/material/input";
import {SelectorItemType} from '../models/SelectorItemType';
import {MessagesComponent} from '../messages/messages.component';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'app-song-commands',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatInput, MessagesComponent],
  templateUrl: './simple-commands.component.html',
  styleUrls: ['./simple-commands.component.scss'],
  providers: [SimpleCommandsService]
})
export class SimpleCommandsComponent implements OnInit {

  public message = '';

  public model = new SongIngestionModel();

  filteredOptions = new Observable<SelectorItem[]>();



  //a subject to be notified every time we want to change the song search string
  private searchTerms = new Subject<string>();

  constructor(private httpClient: HttpClient, private  selectorService: SelectorsService, private simpleCommandsService: SimpleCommandsService,
              private messagesService: MessagesService) {
  }

  /**
   * a command coming from the UI indicating that it is time to change the substring we use for querying songs
   * @param query
   */
  search(query: string): void {
    this.searchTerms.next(query);
  }

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
    this.filteredOptions = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.fetchOptions(query))
    );
  }





  reingestFrom() {
    this.message = '';
    this.httpClient.put<InputView>('http://localhost:8090/utils/ingestStartingWith', {}, {params: {urlKey: this.model.selectedItem.key}}).toPromise()
      .then(() => this.message = 'Reingestion successful!')
      .catch(reason => {
        this.message = reason.error;
      });
  }

  reindexFrom() {
    this.message = '';
    this.httpClient.put<InputView>('http://localhost:8090/utils/indexStartingWith',  {}, {params: {urlKey: this.model.selectedItem.key}} ).toPromise()
      .then(() => this.message = 'Word Indexation successful!')
      .catch(reason => {
        this.message = reason.error;
      });
  }

  htmlDescription() {
    this.message = '';
    this.httpClient.put('http://localhost:8090/utils/htmlDescription',  {}, {params: {urlKey: this.model.selectedItem.key}} ).toPromise()
      .then(response => {
        // @ts-ignore
        return this.message = response.html;
      })
      .catch(reason => {
        this.message = reason.error;
      });
  }

  refreshStats() {
    this.message = '';
    this.simpleCommandsService.regenerateStats().toPromise().then(
      response => {
        // @ts-ignore
        return this.message = 'Stats refreshed successfully';
      })
      .catch(reason => {
        this.message = reason.error;
      });
  }


  regenerateOneTag() {
    this.message = '';
    this.httpClient.put<ApiResponse>('http://localhost:8090/seo/jsonld/tag/regenerate_one/' + this.model.selectedItem.key, {})
      .pipe(
        catchError(err => {
          this.messagesService.showErrors(err.error);
          return throwError(err);
        })
      ).subscribe(response => {
        this.messagesService.showMessages(`Tag ${this.model.selectedItem.key} regenerated successfully`);
        console.log('spell check regeneration succeeded');
    });
  }



  regenerateSpellCheck() {
    this.simpleCommandsService.regenerateSpellCheck().pipe(
      catchError(err => {
        this.messagesService.showErrors(err.error);
        return throwError(err);
      })
    ).subscribe(response => {
      this.messagesService.showMessages('Spell Check regenerated successfully');
      console.log('spell check regenerated successfully');
    });
  }

  clearCaches() {
    this.message = '';
    this.httpClient.put('http://localhost:8080/murshid-api/caches/clear',  {}).pipe(
      tap( () => this.message = 'Cache cleared!'),
      catchError(reason => this.message = reason.message)
    ).subscribe();
  }


  generateSitemap() {
    this.message = '';
    // @ts-ignore
    this.httpClient.put<string>('http://localhost:8090/utils/sitemap',  {}, { responseType: 'text' as 'text' } ).pipe(
      tap( () => this.message = 'Sitemap Generated!'),
      catchError(reason => this.message = reason.message)
    ).subscribe();
  }

  reingestAll() {
    this.message = '';
    this.httpClient.put('http://localhost:8090/utils/ingestall',  {} ).pipe(
      tap( () => this.message = 'All reingested!'),
      catchError(reason => this.message = reason.message)
    ).subscribe();
  }


  regenerateAllTagJsonLds() {
    this.message = '';
    this.httpClient.put('http://localhost:8090/seo/jsonld/tag/regenerate_all',  {} ).pipe(
      tap( () => this.message = 'All JsonLds regenerated!'),
      catchError(reason => this.message = reason.message)
    ).subscribe();
  }


  regenerateTagJsonLdsStartingFrom() {
    this.message = '';
    this.httpClient.put<InputView>('http://localhost:8090/seo/jsonld/tag/regenerate_starting_with', {}, {params: {tagKey: this.model.selectedItem.key}}).toPromise()
      .then(() => this.message = 'Tag JsonLds regeneration starting with ' + this.model.selectedItem.key + ' was  successful!')
      .catch(reason => {
        this.message = reason.error;
      });
  }







}
