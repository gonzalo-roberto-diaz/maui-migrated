import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DataService} from '../../services/data.service';
import {DictionaryUpdateView} from './DictionaryUpdateView';
import {PartOfSpeech} from '../../models/PartOfSpeech';
import {SearchType} from '../../SearchType';

@Component({
  selector: 'app-dictionary-update',
  standalone: true,
  imports: [MatDialogModule],
  providers: [
       {
         provide: MatDialogRef,
         useValue: {}
       }
  ],
  templateUrl: './dictionary-update-dialog.component.html',
  styleUrls: ['./dictionary-update-dialog.component.css']
})
export class DictionaryUpdateDialogComponent implements OnInit {


  public partOfSpeechComboValues = Object.keys(PartOfSpeech).map(s => s.toUpperCase());

  currentPoS: PartOfSpeech = PartOfSpeech.Noun;


  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DictionaryUpdateDialogComponent>,
    private dataService: DataService, @Inject(MAT_DIALOG_DATA) public updateView: DictionaryUpdateView) {

    this.form = fb.group({
      master_dictionary_id: [updateView.master_dictionary_id, Validators.required],
      meaning: [updateView.meaning, Validators.required],
      part_of_speech: [updateView.part_of_speech, Validators.required],
      hindi_word: [updateView.hindi_word, Validators.required],
      urdu_word: [updateView.urdu_word, Validators.required],
      romanized_word: [updateView.romanized_word, Validators.required]
    });


    // this.currentPoS = updateView.part_of_speech;
    // @ts-ignore
    // this.form.controls['part_of_speech'].setValue(updateView.part_of_speech.toString(), {onlySelf: true});
    // this.form.get('part_of_speech').setValue(updateView.part_of_speech);

  }

  ngOnInit() {
  }


  submit(form: FormGroup): void {
    const values = form.value;
    const updateView = new DictionaryUpdateView();
    updateView.master_dictionary_id = values.master_dictionary_id;
    updateView.hindi_word = values.hindi_word.trim();
    updateView.urdu_word = values.urdu_word.trim();

    updateView.part_of_speech = values.part_of_speech.trim();
    updateView.romanized_word = values.romanized_word.trim();
    updateView.meaning = values.meaning;

    this.dataService.updateDictionary(updateView)
      .subscribe();
    this.dialogRef.close(this.updateView);
  }

  close() {
    this.dialogRef.close();
  }

}
