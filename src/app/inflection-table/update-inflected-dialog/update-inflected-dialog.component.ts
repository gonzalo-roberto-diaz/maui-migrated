import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InflectionTableService} from '../../services/inflection-table.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {InflectedItem} from '../../models/InflectedItem';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-update-inflected-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatDialogModule, ReactiveFormsModule, MatInput],
  templateUrl: './update-inflected-dialog.component.html',
  styleUrls: ['./update-inflected-dialog.component.css']
})
export class UpdateInflectedDialogComponent implements OnInit {

  form: FormGroup;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateInflectedDialogComponent>,
    private inflectionTableService: InflectionTableService, @Inject(MAT_DIALOG_DATA) public inflectedItem: InflectedItem) {

    this.form = fb.group({
      hindi: [inflectedItem.hindi, Validators.required],
      index: [inflectedItem.index, Validators.required]
    });

  }

  ngOnInit() {
  }

  submit(form: FormGroup): void {
    const values = form.value;
    this.inflectionTableService.putLine(this.inflectedItem.urlKey, this.inflectedItem.position, values.hindi.trim(), values.index)
      .subscribe();
    this.dialogRef.close(this.inflectedItem);
  }

  close() {
    this.dialogRef.close();

  }

}
