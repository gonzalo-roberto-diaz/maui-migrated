import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DataService} from '../../services/data.service';
import {DictionaryUpdateView} from './DictionaryUpdateView';
import {PartOfSpeech} from '../../models/PartOfSpeech';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select'
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {SearchType} from '../../SearchType';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dictionary-update',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatDialogModule, ReactiveFormsModule, MatOption, MatSelect, MatInput, MatButton, FormsModule],
  templateUrl: './dictionary-update.component.html',
  styleUrls: ['./dictionary-update.component.scss']
})
export class DictionaryUpdateDialogComponent implements OnInit {

  linkTypes: SearchType[] = [];
  public partOfSpeechComboValues: SearchType[] =
    Object.keys(PartOfSpeech).map(s => new SearchType(s.valueOf().toUpperCase(), s.valueOf().toUpperCase()));

  currentPoS: SearchType = new SearchType('NOUN', PartOfSpeech.Noun.valueOf());



  constructor(
    public dialogRef: MatDialogRef<DictionaryUpdateDialogComponent>,
    private dataService: DataService, @Inject(MAT_DIALOG_DATA) public updateView: DictionaryUpdateView) {




    // this.currentPoS = updateView.part_of_speech;
    // @ts-ignore
    // this.form.controls['part_of_speech'].setValue(updateView.part_of_speech.toString(), {onlySelf: true});
    // this.form.get('part_of_speech').setValue(updateView.part_of_speech);

  }

  ngOnInit() {
  }


  submit(): void {
    this.dataService.updateDictionary(this.updateView)
      .subscribe();
    this.dialogRef.close(this.updateView);
  }

  close() {
    this.dialogRef.close();
  }

  compareFn(o1: SearchType, o2: SearchType): boolean {
    if (o1 && o2) {
      return o1.value === o2.value;
    }else{
      return false;
    }
  }

}
