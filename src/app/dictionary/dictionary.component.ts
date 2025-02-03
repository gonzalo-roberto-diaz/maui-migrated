import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {TableModel} from '../models/TableModel';
import {GlobalsService} from '../services/globals.service';
import {PartOfSpeech} from '../models/PartOfSpeech';
import {SearchType} from '../SearchType';
import {MatSelectModule} from '@angular/material/select';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {filter, tap} from 'rxjs/operators';
import {SimpleEntry} from '../models/SimpleEntry';
import {DictionaryUpdateDialogComponent} from './dictionary-update/dictionary-update.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from "@angular/material/input";


@Component({
  selector: 'app-table',
  standalone: true,
    imports: [CommonModule, FormsModule, MatSelectModule, MatIconModule, MatButtonModule, MatInput],
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit, OnDestroy {

  public model = new TableModel();

  private lastSearch = 'byMorphology';

  public partOfSpeechComboValues =  Object.keys(PartOfSpeech).map(strName => new SearchType(strName, strName));


  constructor(private dataService: DataService, public globals: GlobalsService,  public dialog: MatDialog) { }

  ngOnInit() {
    this.model = this.globals.tableModel;
  }

  ngOnDestroy(): void {
    this.globals.tableModel = this.model;
  }

  hindiClicked() {
    this.dataService.findHindi(this.model.hindi).subscribe(r => this.model.entries = r);
  }


  morphologyClicked() {
    this.dataService.findMorphology(this.model.morphology).subscribe(r => this.model.entries = r);
  }

  meaningClicked() {
    this.dataService.findMeaning(this.model.meaning, this.model.partOfSpeech).subscribe(r => this.model.entries = r);
  }

  masterHindiSubstringClicked() {
    this.dataService.findByMasterHindiSubstring(this.model.masterHindiSubstring).subscribe(r => this.model.entries = r);
  }

  masterUrduSubstringClicked() {
    this.dataService.findByMasterUrduSubstring(this.model.masterUrduSubstring).subscribe(r => this.model.entries = r);
  }

  updateDictionary(entry: SimpleEntry): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100em';

    dialogConfig.data = {
      master_dictionary_id: entry.id,
      part_of_speech: entry.partOfSpeech,
      romanized_word: entry.latin,
      urdu_word: entry.urdu,
      hindi_word: entry.hindi,
      meaning: entry.meaning
    };


    const dialogRef = this.dialog.open(DictionaryUpdateDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      filter(val => !!val),
      tap(() => {
        switch (this.lastSearch) {
          case 'byMorphology':
            this.morphologyClicked();
            break;
          default:
            this.morphologyClicked();
            break;
        }
      })
    ).subscribe();

  }


}

