import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalsService} from '../services/globals.service';
import {SelectorsService} from '../services/selector.service';
import {SelectorItem} from '../models/SelectorItem';
import {catchError, filter, map, startWith, tap} from 'rxjs/operators';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap, throwError} from 'rxjs';
import {FormControl} from '@angular/forms';
import {InflectionTableModel} from '../models/InflectionTableModel';
import {InflectionTableItemType} from '../models/InflectionTableItemType';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddMasterDialogComponent} from './add-master-dialog/add-master-dialog.component';
import {InflectionTableService} from '../services/inflection-table.service';
import {UpdateInflectedDialogComponent} from './update-inflected-dialog/update-inflected-dialog.component';
import { CommonModule } from '@angular/common';
import {MessagesComponent} from '../messages/messages.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {SelectorItemType} from '../models/SelectorItemType';


@Component({
  selector: 'app-inflection-table',
  standalone: true,
  imports: [CommonModule, MessagesComponent, MatAutocompleteModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormField, MatInput, MatLabel],
  templateUrl: './inflection-table.component.html',
  styleUrls: ['./inflection-table.component.scss']
})
export class InflectionTableComponent implements OnInit , OnDestroy {

  public model = new InflectionTableModel();

  //the array of SelectorItems to show in the dropdown, representing songs whose key fields  contain the searchQuery substring
  filteredOptions = new Observable<SelectorItem[]>();

  //a subject to be notified every time we want to change the song search string
  private searchTerms = new Subject<string>();

  // Expose the enum to the template
  InflectionTableItemType = InflectionTableItemType;



  constructor(private globals: GlobalsService,
              private selectorService: SelectorsService, public dialog: MatDialog,
              private inflectionTableService: InflectionTableService) {
  }

  /**
   * a command coming from the UI indicating that it is time to change the substring we use for querying songs
   * @param query
   */
  search(query: string): void {
    this.searchTerms.next(query);
  }

  ngOnInit() {
    this.model = this.globals.inflectionTableModel;
    this.filteredOptions = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.fetchOptions(query))
    );
  }



  onOptionSelected(item: SelectorItem): void {
    this.model.selectedItem = item;
    this.model.searchQuery = item.key;
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
    this.globals.inflectionTableModel = this.model;

  }

  getSong() {
    this.model.message = '';
    this.inflectionTableService.getSong(this.model.selectedItem.key)
      .pipe(
        // tslint:disable-next-line:no-shadowed-variable
        tap(map => this.model.map = map),
        catchError(err => {
          this.model.message = err;
          console.log(err);
          return throwError(err);
        })
      ).subscribe(() => {
        this.model.message = 'Song loaded!';
    });
  }

  putSong() {
    this.model.message = '';
    this.inflectionTableService.putSong(this.model.map, this.model.selectedItem.key).subscribe();
  }

  generateTable() {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.inflectionTableService.createTable(fileName).subscribe();
  }

  resequenceTable() {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.inflectionTableService.resequenceTable(fileName).toPromise()
      .then(() => this.model.message = 'Table resequenced!')
      .catch(reason => this.model.message = reason.message);
  }


  deductFileName(): string {
    let key = this.model.selectedItem.key;
    key = key + '.txt';
    return key;
  }

  onOptionsSelected(event: Event, mapEntry: object) {
    // @ts-ignore
    const optionIndex = event.target.selectedOptions[0].index;
    // @ts-ignore
    const inflectedList = mapEntry.inflectedList;

    // @ts-ignore
    mapEntry.index = inflectedList[optionIndex].inflectedHindiIndex;
  }

  shouldSelect(option: object, mapEntry: object) {
    // @ts-ignore
    const index = mapEntry.index  as number;
    // @ts-ignore
    const inflectedHindiIndex = option.inflectedHindiIndex as  number;
    return inflectedHindiIndex === index;
  }


  updateInflected(mapEntry: any): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    // @ts-ignore
    const entryText = mapEntry.text;
    // @ts-ignore
    const entryPosition = mapEntry.position;
    // @ts-ignore
    const entryIndex = mapEntry.index;

    dialogConfig.data = {
      urlKey: this.model.selectedItem.key,
      position: entryPosition,
      hindi: entryText,
      index: entryIndex
    };


    const dialogRef = this.dialog.open(UpdateInflectedDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => this.getSong())
    ).subscribe();

  }


  insertMasterDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = '400px';

    dialogConfig.data = this.model;

    const dialogRef = this.dialog.open(AddMasterDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
      ).subscribe( val => {
        console.log('after close happened');
        this.model = val;
      });
  }

}
