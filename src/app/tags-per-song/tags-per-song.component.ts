import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {TagsPerSongScreenModel} from "../models/TagsPerSongScreenModel";
import {TagsService} from "../services/tags.service";
import {GlobalsService} from "../services/globals.service";
import {FormControl} from "@angular/forms";
import {SelectorItem} from "../models/SelectorItem";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {SelectorsService} from "../services/selector.service";
import {SelectorItemType} from "../models/SelectorItemType";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelect} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';



interface SearchType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-tags-per-song',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatAutocompleteModule, MatSelect, MatButtonModule],
  templateUrl: './tags-per-song.component.html',
  styleUrls: ['./tags-per-song.component.scss']
})
export class TagsPerSongComponent implements OnInit, OnDestroy {

  public model = new TagsPerSongScreenModel();
  songSelectionControl = new FormControl();
  tagSelectionControl = new FormControl();
  filteredSongOptions = new Observable<SelectorItem[]>();
  songOptions: SelectorItem[] = [];
  filteredTagOptions = new Observable<SelectorItem[]>();
  tagOptions: SelectorItem[] = [];
  linkTypes: SearchType[] = [];
  lastSearch = '';

  constructor(private allTagsService: TagsService, public globals: GlobalsService, private selectorService: SelectorsService) {
    this.tagOptions = [];
    this.songOptions = [];
    this.selectorService.retrieveAllItems().subscribe(results => {
      results.forEach(result => {
        if (result.type === SelectorItemType.Song) {
          this.songOptions.push(result);
        } else if (result.type === SelectorItemType.Tag) {
          this.tagOptions.push(result);
        }
      });
    });

    this.linkTypes = [

      {value: 'ACTOR', viewValue: 'Actor'},
      {value: 'ACTOR_GROUP', viewValue: 'Actor Group'},
      {value: 'CATEGORY', viewValue: 'Category'},
      {value: 'COMPOSER', viewValue: 'Composer'},
      {value: 'COMPOSER_GROUP', viewValue: 'Composer Group'},
      {value: 'LYRICIST', viewValue: 'Lyricist'},
      {value: 'LYRICIST_GROUP', viewValue: 'Lyricist Group'},
      {value: 'MOVIE', viewValue: 'Movie'},
      {value: 'OTHER', viewValue: 'Other'},
      {value: 'SHOW', viewValue: 'Show'},
      {value: 'RECORD_LABEL', viewValue: 'Record Label'},
      {value: 'SINGER', viewValue: 'Singer'},
      {value: 'SINGER_GROUP', viewValue: 'Singer Group'}
    ];
  }

  ngOnInit() {
    this.model = this.globals.tagsPerSongScreenModel;
    this.filteredSongOptions = this.songSelectionControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filterSongs(val) : [])
      );

    this.filteredTagOptions = this.tagSelectionControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filterTags(val) : [])
      );
  }

  ngOnDestroy(): void {
    this.globals.tagsPerSongScreenModel = this.model;
  }

  filterSongs(val: string): SelectorItem[] {
    return this.songOptions.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  filterTags(val: string): SelectorItem[] {
    return this.tagOptions.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }

  deleteLink(urlKey: string, tagKey: string, tagType: string) {
    this.allTagsService.deleteTpsLink(urlKey, tagKey, tagType)
      .subscribe(() => this.refreshList());
  }

  selectLinksBySong() {
    if (!this.model.selectedSong) {
      alert('No song selected!');
    } else {
      this.lastSearch = 'SONG';
      const urlKey = this.model.selectedSong.key;
      this.allTagsService.getTpsPerSong(urlKey)
        .subscribe(values => {
          this.model.tpsViews = values;
        });

    }
  }

  selectLinksByTag() {
    if (!this.model.selectedTag) {
      alert('No tag selected!');
    } else {
      this.lastSearch = 'TAG';
      const tagKey = this.model.selectedTag.key;
      this.allTagsService.getTpsPerTag(tagKey)
        .subscribe(values => {
          this.model.tpsViews = values;
        });
    }
  }

  displayFn(user: SelectorItem | null): string {
    return user?.key ?? ''; // Uses optional chaining (?.) and nullish coalescing (??)
  }

  async someSongSelected(item: SelectorItem) {
    this.model.selectedSong = item;
    // this.model.url = item.key;
  }

  async someTagelected(item: SelectorItem) {
    this.model.selectedTag = item;
    // this.model.url = item.key;
  }

  refreshList() {
    if ('SONG' === this.lastSearch) {
      console.log('will refresh by song');
      this.selectLinksBySong();
    } else if ('TAG' === this.lastSearch) {
      this.selectLinksByTag();
      console.log('will refresh by tag');
    } else {
      alert('No last search detected!');
    }
  }


  createLink() {
    if (!this.model.selectedTag) {
      alert('no tag selected');
    } else if (!this.model.selectedSong) {
      alert('no song selected');
    } else if (!this.model.selectedType) {
      alert('no link type selected');
    } else {
      this.allTagsService.createTpsLink(this.model.selectedSong.key, this.model.selectedTag.key, this.model.selectedType).
      subscribe(() => this.refreshList());

    }
  }

}
