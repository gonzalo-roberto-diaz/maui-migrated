import {Component, OnDestroy, OnInit} from '@angular/core';
import {InflectedModel} from '../models/InflectedModel';
import {DataService} from '../services/data.service';
import {GlobalsService} from '../services/globals.service';
import {Inflected} from '../models/Inflected';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {filter, tap} from 'rxjs/operators';
import {InflectedUpdateDialogComponent} from './inflected-update-dialog/inflected-update-dialog.component';
import {InflectedInsertDialogComponent} from './inflected-insert-dialog/inflected-insert-dialog.component';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-inflected',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './inflected.component.html',
  styleUrls: ['./inflected.component.scss']
})
export class InflectedComponent implements OnInit, OnDestroy {

  public model = new InflectedModel();
  private lastSearch = 'byWord';

  constructor(private dataService: DataService, public globals: GlobalsService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.model = this.globals.inflectedModel;
  }

  ngOnDestroy(): void {
    this.globals.inflectedModel = this.model;
  }

  inflectedHindiClicked(): void {
    this.dataService.findInflectedByWord(this.model.inflectedHindi).subscribe(r => this.model.entries = r);
    this.lastSearch = 'byInflectedHindi';
  }

  masterDictionaryIdClicked(): void {
    this.dataService.findByMasterDictionaryid(this.model.masterDictionaryId).subscribe(r => this.model.entries = r);
    this.lastSearch = 'byMasterDictionary';
  }

  accidenceToString(inflected: Inflected): string {
    if (typeof(inflected.accidences) === 'undefined') {
      return 'UNDEFINED!';
    } else if (inflected.accidences === null) {
      return '';
    } else {
      return inflected.accidences.toString();
    }
  }

  updateInflected(inflected: Inflected): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    dialogConfig.data = {
      key_inflected_hindi: inflected.inflectedHindi,
      key_inflected_hindi_index: inflected.inflectedHindiIndex,
      inflected_hindi: inflected.inflectedHindi,
      inflected_urdu: inflected.inflectedUrdu,
      inflected_romanized: inflected.inflectedRomanized,
      part_of_speech: inflected.partOfSpeech,
      accidenceString : this.accidenceToString(inflected)
    };


    const dialogRef = this.dialog.open(InflectedUpdateDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => {
        switch (this.lastSearch) {
          case 'byInflectedHindi':
            this.inflectedHindiClicked();
            break;
          default:
            this.masterDictionaryIdClicked();
            break;
        }
      })
    ).subscribe();

  }

  deleteInflected(inflectedHindi: string, inflectedHindiIndex: number): void {

    this.dataService.deleteInflected(inflectedHindi, inflectedHindiIndex).subscribe(() => {
      switch (this.lastSearch) {
        case 'byInflectedHindi':
          this.inflectedHindiClicked();
          break;
        default:
          this.masterDictionaryIdClicked();
          break;
      }
    });
  }

  insertInflected(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';


    dialogConfig.data = {
      master_dictionary_id: '',
      key_inflected_hindi: '',
      key_inflected_hindi_index: '',
      inflected_hindi: '',
      inflected_urdu: '',
      inflected_romanized: '',
      accidenceString: '',
      partOfSpeech: ''
    };

    const dialogRef = this.dialog.open(InflectedInsertDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => {
        switch (this.lastSearch) {
          case 'byInflectedHindi':
            this.inflectedHindiClicked();
            break;
          default:
            this.masterDictionaryIdClicked();
            break;
        }
      })
    ).subscribe();

  }


}
