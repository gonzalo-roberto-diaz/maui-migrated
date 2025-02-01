import {Component, OnDestroy, OnInit} from '@angular/core';
import {AllTagsModel} from '../models/AllTagsModel';
import {TagsService} from '../services/tags.service';
import {GlobalsService} from '../services/globals.service';
import {TagView} from '../models/TagView';
import {catchError, tap} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import {MessagesComponent} from '../messages/messages.component';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-all-tags',
  standalone: true,
  imports: [CommonModule, MessagesComponent, FormsModule, MatButtonModule, MatFormField, MatInput, MatLabel],
  templateUrl: './all-tags.component.html',
  styleUrls: ['./all-tags.component.scss']
})
export class AllTagsComponent implements OnInit, OnDestroy {

  public model = new AllTagsModel();

  constructor(private tagsService: TagsService, public globals: GlobalsService) {
  }

  ngOnInit() {
    this.model = this.globals.allTagsModel;
  }

  ngOnDestroy(): void {
    this.globals.allTagsModel = this.model;
  }

  loadBySubstring(substring: string) {
    this.tagsService.selectBySubstring(substring)
      .subscribe(values => this.model.tags = values);
  }

  validate(tagView: TagView): boolean {
    if (!tagView.key || tagView.key.trim() === '') {
      alert('a tag key is necessary');
      return false;
    }

    if (tagView.key.indexOf(' ') >= 0) {
      alert('the tag key cannot contain white spaces');
      return false;
    }

    if (tagView.key.toLowerCase() !== tagView.key) {
      alert('the tag key should be all lowercase');
      return false;
    }

    if (!tagView.hindi || tagView.hindi.trim() === '') {
      alert('a hindi title is necessary');
      return false;
    }

    if (!tagView.urdu || tagView.urdu.trim() === '') {
      alert('an urdu title is necessary');
      return false;
    }

    if (!tagView.title || tagView.title.trim() === '') {
      alert('a title  is necessary');
      return false;
    }

    if (!tagView.description || tagView.description.trim() === '') {
      alert('a description is necessary');
      return false;
    }

    return true;
  }

  insert() {
    if (!this.validate(this.model.buffer)) {
      return;
    }

    this.tagsService.insert(this.model.buffer)
      .pipe(
        tap(() => this.loadBySubstring(this.model.buffer.title)),
        tap( () => this.tagsService.generateJsonDl(this.model.buffer.key))
      ).subscribe(() => alert('tag inserted and its JsonLD generated'));
  }

  clear() {
    this.model.buffer = new TagView();
    this.model.searchSubstring = '';
  }

  createKey() {
    if (!this.model.buffer.title || this.model.buffer.title.trim() === '') {
      alert('no title to build the key from!');
      return;
    }

    this.model.buffer.key = this.model.buffer.title.toLowerCase().replace(/ /g, '-');
  }

  deleteByKey(key: string) {
    this.tagsService.delete(key)
      .pipe(
        tap(() => {
          alert('Tag deleted successfully');
          this.model.tags = [];
        }),
        catchError((err, caught) => {
          alert('The tag could NOT be deleted!');
          return caught;
        })
      ).subscribe();
  }


}
