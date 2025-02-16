import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {DataService} from '../../services/data.service';
import {InflectedView} from '../../models/InflectedView';
import {PartOfSpeech} from '../../models/PartOfSpeech';
import {SearchType} from '../../SearchType';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-inflected-update-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './inflected-insert-dialog.component.html',
  styleUrls: ['./inflected-insert-dialog.component.scss']
})
export class InflectedInsertDialogComponent implements OnInit {

  // public partOfSpeechComboValues = Object.keys(PartOfSpeech).map(strName => new SearchType(strName, strName));
  public partOfSpeechComboValues = Object.values(PartOfSpeech);

  form: FormGroup;

  currentPoS: PartOfSpeech = PartOfSpeech.Noun;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InflectedInsertDialogComponent>,
    private dataService: DataService, @Inject(MAT_DIALOG_DATA) public inflectedView: InflectedView) {
    console.log('entries ='+  Object.entries(PartOfSpeech));
    this.form = fb.group({
      master_dictionary_id: [inflectedView.master_dictionary_id, Validators.required],
      inflected_hindi: [inflectedView.inflected_hindi, Validators.required],
      inflected_urdu: [inflectedView.inflected_urdu, Validators.required],
      inflected_romanized: [inflectedView.inflected_romanized, Validators.required],
      inflected_hindi_index: [inflectedView.key_inflected_hindi_index, Validators.required],
      part_of_speech: [inflectedView.part_of_speech, Validators.required],
      accidenceString: ['', Validators.required],
      override_accidence_validation: [inflectedView.override_accidence_validation, Validators.required]
    });
  }

  ngOnInit() {
  }

  submit(form: FormGroup): void {
    const values = form.value;
    const inflectedView = new InflectedView();
    inflectedView.inflected_hindi = values.inflected_hindi.trim();
    inflectedView.inflected_romanized = values.inflected_romanized.trim();
    inflectedView.inflected_urdu = values.inflected_urdu.trim();
    inflectedView.inflected_hindi_index = values.inflected_hindi_index;
    inflectedView.key_inflected_hindi = this.inflectedView.key_inflected_hindi;
    inflectedView.key_inflected_hindi_index = this.inflectedView.key_inflected_hindi_index;
    inflectedView.part_of_speech =   this.currentPoS.toString().toUpperCase();
    inflectedView.override_accidence_validation = values.override_accidence_validation;

    let accidences: string[];
    if (values.accidenceString != null && values.accidenceString.length > 0) {
      accidences = values.accidenceString.split(',');
      accidences = accidences.map(str => str.trim());
      inflectedView.accidence = accidences;
    } else {
      inflectedView.accidence = null;
    }

    this.dataService.insertInflected(inflectedView, values.master_dictionary_id)
      .subscribe();
    this.dialogRef.close(this.inflectedView);
  }

  close() {
    this.dialogRef.close();
  }

  onSelectionChange(selectedValue: string) {
    this.currentPoS = selectedValue as PartOfSpeech;
  }
}
