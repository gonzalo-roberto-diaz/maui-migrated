import {Component, OnDestroy, OnInit} from '@angular/core';
import {InputView} from '../models/InputView';
import {PartOfSpeech} from '../models/PartOfSpeech';
import {HttpClient} from '@angular/common/http';
import {EnumUtils} from '../utils/EnumUtils';
import {GlobalsService} from '../services/globals.service';
import {InputModel} from '../models/InputModel';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';
import {SearchType} from '../SearchType';
import {InputAccidence} from '../models/InputAccidence';
import {MessagesComponent} from '../messages/messages.component';
import {MessagesService} from '../services/messages.service';
import {WordUtils} from '../utils/WordUtils';


@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatCheckbox, MessagesComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements OnInit, OnDestroy {

  public model = new InputModel();

  public accidenceOptions = Object.values(InputAccidence) as InputAccidence[];


  public partOfSpeechComboValues = Object.keys(PartOfSpeech).map(strName => new SearchType(strName, strName));

  constructor(private httpClient: HttpClient, public globals: GlobalsService, private messagesService: MessagesService) {
  }

  ngOnInit() {
    this.model = this.globals.inputModel;
  }

  ngOnDestroy(): void {
    this.globals.inputModel = this.model;
  }



  hasAccidenOfString(value: string): boolean {
    const inputAccidence =  EnumUtils.accidenceFromString(value);
    return this.model.inputView.accidence.includes(inputAccidence);
  }

  changedPartOfSpeech(event: Event): void {
    console.log('changed part of speech');
    // @ts-ignore
    this.model.inputView.part_of_speech = EnumUtils.partOfSpeechFromString(event.target.value);
  }



  validate(): boolean {
    if (this.model.inputView.part_of_speech === PartOfSpeech.None) {
      this.messagesService.showErrors('No Part of Speech selected');
      return false;
    } else if (this.model.inputView.index < 0) {
      this.messagesService.showErrors('Index cannot be less than 0');
      return false;
    } else if (this.model.inputView.meaning === undefined || this.model.inputView.meaning.trim() === '') {
      this.messagesService.showErrors( 'Meaning cannot be empty');
      return false;
    } else if (this.model.inputView.hindi === undefined || this.model.inputView.hindi.trim() === '') {
      this.messagesService.showErrors('Hindi cannot be empty');
      return false;
    } else if (this.model.inputView.urdu === undefined || this.model.inputView.urdu.trim() === '') {
      this.messagesService.showErrors('Urdu cannot be empty');
      return false;
    } else if (/\s/.test(this.model.inputView.urdu.trim())) {
      this.messagesService.showErrors('The Urdu word cannot contain spaces of any kind');
      return false;
    } else if ((typeof (this.model.inputView.accidence) === 'undefined' || this.model.inputView.accidence.length === 0) && this.model.inputView.part_of_speech === 'NOUN'  && !this.model.inputView.treat_as_invariable) {
      this.messagesService.showErrors('Nouns need to be masculine or feminine');
      return false;
    }
    this.model.inputView.urdu = this.model.inputView.urdu.trim();
    this.model.inputView.hindi = this.model.inputView.hindi.trim();
    this.model.inputView.meaning = this.model.inputView.meaning.trim();
    return true;
  }

  latinize() {
    this.httpClient.get<any>( 'http://localhost:8090/utils/transliterate',  {params: { hindiText: this.model.inputView.hindi}}).toPromise()
      .then(result => {
        this.model.inputView.latin = result.latin;
      })
      .catch(reason => {
        console.log(reason);
        this.messagesService.showErrors( reason.message);
      });
  }

  hyphenateUrdu() {
    this.model.inputView.urdu = WordUtils.hyphenateUrdu(this.model.inputView.hindi, this.model.inputView.urdu);
  }

  resetForm(): void {
    this.model.inputView = new InputView();
    this.model.message = '';
  }

  onSubmit(): void {
    if (!this.validate()) {
      return;
    }
    this.model.message = '';
    this.httpClient.post<InputView>('http://localhost:8090/multiinput/insertall', this.model.inputView).toPromise()
      .then(() => this.messagesService.showMessages( 'Success!'))
      .catch(reason => this.messagesService.showErrors( reason.message));
  }

  onSelectionChange(selectedValue: InputAccidence) {
    // Update accidence based on selection
    this.model.inputView.accidence = (selectedValue === InputAccidence.None) ? [] : [selectedValue];
  }

}
