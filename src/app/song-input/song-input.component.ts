import {Component, OnDestroy, OnInit} from '@angular/core';
import {SongInputView} from '../models/SongInputView';
import {HttpClient} from '@angular/common/http';
import {GlobalsService} from '../services/globals.service';
import {SongInputModel} from '../models/SongInputModel';
import {InputView} from '../models/InputView';
import { MatDatepickerModule } from   '@angular/material/datepicker';
import { MatNativeDateModule } from   '@angular/material/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';


@Component({
  selector: 'app-song-input',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule, FormsModule, MatButtonModule, MatFormField, MatInput, MatLabel],
  providers: [MatDatepickerModule],
  templateUrl: './song-input.component.html',
  styleUrls: ['./song-input.component.scss']
})
export class SongInputComponent implements OnInit, OnDestroy {

  public model = new SongInputModel();

  constructor(private httpClient: HttpClient, public globals: GlobalsService) { }

  ngOnInit() {
    this.model = this.globals.songInputModel;
  }

  ngOnDestroy(): void {
    this.globals.songInputModel = this.model;
  }

  resetForm() {
    this.model.songInputView = new SongInputView();
  }

  onSubmit() {
    console.log('submitted');
    // this.validate();
    this.model.message = '';
    this.httpClient.post<InputView>('http://localhost:8090/songs/createsongtemplate', this.model.songInputView ).toPromise()
      .then(() => this.model.message = 'Success!')
      .catch(reason => this.model.message = reason.message);
  }

}
