import { Routes } from '@angular/router';
import {InputComponent} from "./input/input.component";
import {DictionaryComponent} from "./dictionary/dictionary.component";
import {SimpleCommandsComponent} from "./simple-commands/simple-commands.component";
import {SongIngestionComponent} from "./song-ingestion/song-ingestion.component";
import {SongValidationComponent} from "./song-validation/song-validation.component";
import {InflectedComponent} from "./inflected/inflected.component";
import {TransliterationComponent} from "./transliteration/transliteration.component";
import {InflectionTableComponent} from "./inflection-table/inflection-table.component";
import {AllTagsComponent} from "./all-tags/all-tags.component";
import {TagsPerSongComponent} from "./tags-per-song/tags-per-song.component";
import {AllSongsComponent} from './all-songs/all-songs.component';


export const routes: Routes = [
  { path: '', redirectTo: '/word-input', pathMatch: 'full' },
  { path: 'word-input', component: InputComponent },
  { path: 'dictionary', component: DictionaryComponent },
  { path: 'song-commands', component: SimpleCommandsComponent },
  { path: 'song-ingestion', component: SongIngestionComponent },
  { path: 'inflection-table', component: InflectionTableComponent },
  { path: 'song-validation', component: SongValidationComponent },
  { path: 'inflected', component: InflectedComponent },
  { path: 'transliteration', component: TransliterationComponent },
  { path: 'all-tags', component: AllTagsComponent },
  { path: 'all-songs', component: AllSongsComponent },
  { path: 'tags-per-song', component: TagsPerSongComponent },
];


