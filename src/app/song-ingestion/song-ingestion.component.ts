import {Component, OnDestroy, OnInit} from '@angular/core';
import {InputView} from '../models/InputView';
import {SongIngestionModel} from '../models/SongIngestionModel';
import {HttpClient} from '@angular/common/http';
import {GlobalsService} from '../services/globals.service';
import {SelectorsService} from '../services/selector.service';
import {SelectorItem} from '../models/SelectorItem';
import {Observable} from 'rxjs';
import {catchError, map, startWith, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-song-ingestion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule],
  templateUrl: './song-ingestion.component.html',
  styleUrls: ['./song-ingestion.component.scss']
})
export class SongIngestionComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  public model = new SongIngestionModel();
  options: SelectorItem[] = [];
  filteredOptions = new Observable<SelectorItem[]>();

  constructor(private httpClient: HttpClient, private globals: GlobalsService, selectorService: SelectorsService) {
    selectorService.retrieveAllItems().subscribe(result => this.options = result);
  }

  ngOnInit() {
    this.model = this.globals.songIngestionModel;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filter(val) : [])
      );
  }

  ngOnDestroy(): void {
    this.globals.songIngestionModel = this.model;

  }

  displayFn(user: SelectorItem): string {
    return user.key!;
  }

  filter(val: string): SelectorItem[] {
    return this.options.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  async somethingSelected(item: SelectorItem) {
    this.model.selectorItem = item;
  }

  resetForm(): void {
    this.model = new SongIngestionModel();
  }

  deductFileName(): string {
    let key = this.model.selectorItem.key;
    key = key + '.txt';
    return key;
  }

  ingestSong(): void {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.httpClient.put<InputView>(`http://localhost:8090/songs/ingest/${fileName}/${this.model.selectorItem.key}`, {}).pipe(
      tap(
        () => this.model.message = 'Success!'
      ),
      catchError(err => this.model.message = err.error)
    ).subscribe();
  }

  indexSong(): void {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.httpClient.put<InputView>(`http://localhost:8090/songs/index_words/${fileName}/${this.model.selectorItem.key}`, {}).pipe(
      tap(
        () => this.model.message = 'Success!'
      ),
      catchError(err => this.model.message = err.error)
    ).subscribe();
  }


}
