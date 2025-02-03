import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalsService} from '../services/globals.service';
import {TransliterationModel} from '../models/TransliterationModel';
import {HttpClient} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-transliteration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatFormField, MatInput, MatLabel],
  templateUrl: './transliteration.component.html',
  styleUrls: ['./transliteration.component.scss']
})
export class TransliterationComponent implements OnInit, OnDestroy {

  public model = new TransliterationModel();

  constructor(private httpClient: HttpClient, public globals: GlobalsService) { }

  ngOnInit() {
    this.model = this.globals.transliterationModel;
  }

  ngOnDestroy(): void {
    this.globals.transliterationModel = this.model;
  }

  hindiToLatinAutomaticClicked() {
    this.model.message = '';

    this.httpClient.get<any>( 'http://localhost:8090/utils/transliterate',  {params: { hindiText: this.model.hindi}}).toPromise()
      .then(result => {
        this.model.latin = result.latin;
        this.model.message = 'Success!';
      })
      .catch(reason => {
        console.log(reason);
        this.model.message = reason.message;
      });
  }

  hindiToLatinClicked() {
    this.model.message = '';

    this.httpClient.get<any>( 'http://localhost:8090/utils/latinFromHindi',  {params: { hindiText: this.model.hindi}}).toPromise()
      .then(result => {
        this.model.latin = result.latin;
        this.model.message = 'Success!';
      })
      .catch(reason => {
        console.log(reason);
        this.model.message = reason.message;
      });
  }

  urduToHindiClicked() {
    this.model.message = '';

    this.httpClient.get<any>( 'http://localhost:8090/utils/hindiFromUrdu',  {params: {urduText: this.model.urdu}}).toPromise()
      .then(result => {
        this.model.hindi = result.hindi;
        this.model.message = 'Success!';
      })
      .catch(reason => {
        console.log(reason);
        this.model.message = reason.message;
      });
  }

  hindiToUrduClicked() {
    this.model.message = '';

    this.httpClient.get<any>( 'http://localhost:8090/utils/urduFromHindi',  {params: {hindiText: this.model.hindi}}).toPromise()
      .then(result => {
        this.model.urdu = result.urdu;
        this.model.message = 'Success!';
      })
      .catch(reason => {
        console.log(reason);
        this.model.message = reason.message;
      });
  }

  latinToIPAClicked() {
    this.model.message = '';

    this.httpClient.get<any>( 'http://localhost:8090/utils/ii_to_ipa',  {params: {'ii_text': this.model.latin}}).toPromise()
      .then(result => {
        this.model.ipa = result.ipa;
        this.model.message = 'Success!';
      })
      .catch(reason => {
        console.log(reason);
        this.model.message = reason.message;
      });
  }

}
