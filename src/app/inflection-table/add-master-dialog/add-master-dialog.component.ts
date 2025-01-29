import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InflectionTableService} from '../../services/inflection-table.service';
import {InflectionTableModel} from '../../models/InflectionTableModel';
import {NgForm} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-master',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule],
  templateUrl: './add-master-dialog.component.html',
  styleUrls: ['./add-master-dialog.component.css']
})
export class AddMasterDialogComponent implements OnInit, OnDestroy {

  constructor(public dialogRef: MatDialogRef<AddMasterDialogComponent>, private inflectionTableService: InflectionTableService, @Inject(MAT_DIALOG_DATA) private inflectionTableModel: InflectionTableModel) {

  }

  ngOnInit() {
  }

  submit(form: NgForm) {
    const values = form.value;
    // @ts-ignore
    const indexes = values.csvalues.split(',').map(x => +x);
    this.inflectionTableService.insertMaster(this.inflectionTableModel, values.hindi,  indexes);
    this.dialogRef.close(this.inflectionTableModel) ;
  }

  close() {
    this.dialogRef.close() ;

  }


  ngOnDestroy(): void {
    console.log('destroying ...');
  }



}
