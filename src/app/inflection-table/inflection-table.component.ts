import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalsService} from '../services/globals.service';
import {SelectorsService} from '../services/selector.service';
import {SelectorItem} from '../models/SelectorItem';
import {catchError, filter, map, startWith, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
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


@Component({
  selector: 'app-inflection-table',
  standalone: true,
  imports: [CommonModule, MessagesComponent, MatAutocompleteModule, FormsModule, ReactiveFormsModule, MatButtonModule ],
  templateUrl: './inflection-table.component.html',
  styleUrls: ['./inflection-table.component.scss']
})
export class InflectionTableComponent implements OnInit , OnDestroy {
  myControl = new FormControl();
  public model = new InflectionTableModel();
  options: SelectorItem[] = [];
  filteredOptions = new Observable<SelectorItem[]>();

  // Expose the enum to the template
  InflectionTableItemType = InflectionTableItemType;



  constructor(private globals: GlobalsService,
              selectorService: SelectorsService, public dialog: MatDialog,
              private inflectionTableService: InflectionTableService) {

    selectorService.retrieveAllItems().subscribe(result => this.options = result);
  }

  ngOnInit() {
    this.model = this.globals.inflectionTableModel;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filter(val) : [])
      );
  }


  displayFn(user: SelectorItem | null): string {
    return user?.key ?? ''; // Uses optional chaining (?.) and nullish coalescing (??)
  }

  filter(val: string): SelectorItem[] {
    return this.options.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  async somethingSelected(item: SelectorItem) {
    this.model.selectorItem = item;
  }

  ngOnDestroy(): void {
    this.globals.inflectionTableModel = this.model;

  }

  getSong() {
    this.model.message = '';
    this.inflectionTableService.getSong(this.model.selectorItem.key)
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
    this.inflectionTableService.putSong(this.model.map, this.model.selectorItem.key)
      .pipe(
        catchError(err => {
          this.model.message = 'Error!';
          console.log(err);
          return throwError(err);
        })
      ).subscribe(() => {
        this.model.message = 'Song Save successful!';
    });
  }

  generateTable() {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.inflectionTableService.createTable(fileName).toPromise()
      .then(() => this.model.message = 'Table created!')
      .catch(reason => this.model.message = reason.message);
  }

  resequenceTable() {
    const fileName = this.deductFileName();
    this.model.message = '';
    this.inflectionTableService.resequenceTable(fileName).toPromise()
      .then(() => this.model.message = 'Table resequenced!')
      .catch(reason => this.model.message = reason.message);
  }


  deductFileName(): string {
    let key = this.model.selectorItem.key;
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
      urlKey: this.model.selectorItem.key,
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
