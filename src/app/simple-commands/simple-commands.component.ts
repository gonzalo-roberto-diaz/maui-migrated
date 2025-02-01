import { Component, OnInit } from '@angular/core';
import {InputView} from '../models/InputView';
import {HttpClient} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {SongIngestionModel} from '../models/SongIngestionModel';
import {SelectorItem} from '../models/SelectorItem';
import {Observable} from 'rxjs';
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

@Component({
  selector: 'app-song-commands',
  standalone: true,
    imports: [CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatInput],
  templateUrl: './simple-commands.component.html',
  styleUrls: ['./simple-commands.component.scss']
})
export class SimpleCommandsComponent implements OnInit {

  public fileName = '';
  public message = '';
  myControl = new FormControl();
  public model = new SongIngestionModel();
  options: SelectorItem[] = [];
  filteredOptions = new Observable<SelectorItem[]>();
  private selectedItem = new SelectorItem();

  constructor(private httpClient: HttpClient, selectorService: SelectorsService, private simpleCommandsService: SimpleCommandsService) {
    selectorService.retrieveAllItems().subscribe(result => this.options = result);
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filter(val) : [])
      );
  }

  displayFn(user: SelectorItem): string  {
    return user.key!;
  }

  filter(val: string): SelectorItem[] {
    return this.options.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  async somethingSelected(item: SelectorItem) {
    this.selectedItem = item;
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
    this.message = '';
    this.httpClient.put<InputView>('http://localhost:8090/spellcheck/regenerate',  {}).pipe(
      tap( () => this.message = 'Spell check regenerated!'),
      catchError(reason => this.message = reason.message)
    ).subscribe();
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
