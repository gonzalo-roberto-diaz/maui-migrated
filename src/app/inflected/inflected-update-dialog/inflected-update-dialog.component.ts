import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {DataService} from '../../services/data.service';
import {InflectedView} from '../../models/InflectedView';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-inflected-update-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './inflected-update-dialog.component.html',
  styleUrls: ['./inflected-update-dialog.component.css']
})
export class InflectedUpdateDialogComponent implements OnInit {

  form: FormGroup;

  currentPoS = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InflectedUpdateDialogComponent>,
    private dataService: DataService, @Inject(MAT_DIALOG_DATA) public inflectedView: InflectedView) {

    this.form = fb.group({
      inflected_hindi: [inflectedView.inflected_hindi, Validators.required],
      inflected_urdu: [inflectedView.inflected_urdu, Validators.required],
      inflected_romanized: [inflectedView.inflected_romanized, Validators.required],
      inflected_hindi_index: [inflectedView.key_inflected_hindi_index, Validators.required],
      accidenceString: [inflectedView.accidenceString, Validators.required]
    });

    // Part of Speech is not updated
    this.currentPoS = inflectedView.part_of_speech;
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

    let accidences: string[] | null = null;

    if (values.accidenceString) {
      accidences = values.accidenceString.split(',');
      // @ts-ignore
      accidences = accidences.map(str => str.trim());
    }
    // @ts-ignore
    inflectedView.accidence = accidences;

    inflectedView.part_of_speech = this.currentPoS.toString().toUpperCase();

    this.dataService.updateInflected(inflectedView.key_inflected_hindi, inflectedView.key_inflected_hindi_index, inflectedView)
      .subscribe();
    this.dialogRef.close(this.inflectedView);
  }

  close() {
    this.dialogRef.close();
  }
}
