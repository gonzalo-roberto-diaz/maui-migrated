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
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-song-ingestion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatLabel, MatFormField, MatInput],
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

  displayFn(user: SelectorItem | null): string {
    return user?.key ?? ''; // Uses optional chaining (?.) and nullish coalescing (??)
  }

  filter(val: string): SelectorItem[] {
    return this.options.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  async somethingSelected(item: SelectorItem) {
    this.model.selectedItem = item;
  }

  resetForm(): void {
    this.model = new SongIngestionModel();
  }

  deductFileName(): string {
    let key = this.model.selectedItem.key;
    key = key + '.txt';
    return key;
  }

  ingestSong(): void {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.httpClient.put<InputView>(`http://localhost:8090/songs/ingest/${fileName}/${this.model.selectedItem.key}`, {}).pipe(
      tap(
        () => this.model.message = 'Success!'
      ),
      catchError(err => this.model.message = err.error)
    ).subscribe();
  }

  indexSong(): void {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.httpClient.put<InputView>(`http://localhost:8090/songs/index_words/${fileName}/${this.model.selectedItem.key}`, {}).pipe(
      tap(
        () => this.model.message = 'Success!'
      ),
      catchError(err => this.model.message = err.error)
    ).subscribe();
  }


}
