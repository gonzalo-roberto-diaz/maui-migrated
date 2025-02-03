import { Component, OnInit } from '@angular/core';
import {InputView} from '../models/InputView';
import {HttpClient} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {SongIngestionModel} from '../models/SongIngestionModel';
import {SelectorItem} from '../models/SelectorItem';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap} from 'rxjs';
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
import {GlobalsService} from '../services/globals.service';
import {SelectorItemType} from '../models/SelectorItemType';
import {MessagesComponent} from '../messages/messages.component';

@Component({
  selector: 'app-song-commands',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatInput, MessagesComponent],
  templateUrl: './simple-commands.component.html',
  styleUrls: ['./simple-commands.component.scss']
})
export class SimpleCommandsComponent implements OnInit {

  public message = '';

  public model = new SongIngestionModel();

  filteredOptions = new Observable<SelectorItem[]>();
  private selectedItem = new SelectorItem();


  //a subject to be notified every time we want to change the song search string
  private searchTerms = new Subject<string>();

  constructor(private httpClient: HttpClient, private  selectorService: SelectorsService, private simpleCommandsService: SimpleCommandsService) {
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
    this.httpClient.put<InputView>('http://localhost:8090/utils/ingestStartingWith', {}, {params: {urlKey: this.selectedItem.key}}).toPromise()
      .then(() => this.message = 'Reingestion successful!')
      .catch(reason => {
        this.message = reason.error;
      });
  }

  reindexFrom() {
    this.message = '';
    this.httpClient.put<InputView>('http://localhost:8090/utils/indexStartingWith',  {}, {params: {urlKey: this.selectedItem.key}} ).toPromise()
      .then(() => this.message = 'Word Indexation successful!')
      .catch(reason => {
        this.message = reason.error;
      });
  }

  htmlDescription() {
    this.message = '';
    this.httpClient.put('http://localhost:8090/utils/htmlDescription',  {}, {params: {urlKey: this.selectedItem.key}} ).toPromise()
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
    this.httpClient.put<ApiResponse>('http://localhost:8090/seo/jsonld/tag/regenerate_one/' + this.selectedItem.key,  {} ).toPromise()
      .then(response => {
        // @ts-ignore
        return this.message = response.message;
      })
      .catch(reason => {
        this.message = reason.error;
      });
  }



  regenerateSpellCheck() {
    this.simpleCommandsService.regenerateSpellCheck().subscribe();
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
    this.httpClient.put<InputView>('http://localhost:8090/seo/jsonld/tag/regenerate_starting_with', {}, {params: {tagKey: this.selectedItem.key}}).toPromise()
      .then(() => this.message = 'Tag JsonLds regeneration starting with ' + this.selectedItem.key + ' was  successful!')
      .catch(reason => {
        this.message = reason.error;
      });
  }







}
