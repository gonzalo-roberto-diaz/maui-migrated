import {Component, OnDestroy, OnInit} from '@angular/core';
import {SongValidationModel} from '../models/SongValidationModel';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalsService} from '../services/globals.service';
import {SelectorItem} from '../models/SelectorItem';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {SelectorsService} from '../services/selector.service';
import {catchError, map, startWith, tap} from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-song-validation',
  standalone: true,
  imports: [MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInput],
  templateUrl: './song-validation.component.html',
  styleUrls: ['./song-validation.component.scss']
})
export class SongValidationComponent implements OnInit, OnDestroy {

  public model = new SongValidationModel();
  myControl = new FormControl();
  options: SelectorItem[] = [];
  filteredOptions =  new  Observable<SelectorItem[]>();



  constructor(private httpClient: HttpClient, private globals: GlobalsService, selectorService: SelectorsService) {
    selectorService.retrieveAllItems().subscribe(result => this.options = result);
  }

  ngOnInit() {
    this.model = this.globals.songValidationModel;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filter(val) : [])
      );
  }

  ngOnDestroy(): void {
    this.globals.songValidationModel = this.model;
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
    // this.model.url = item.key;
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
