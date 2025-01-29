import {SelectorItem} from './SelectorItem';
import {TagsPerSongView} from './TagsPerSongView';

export class TagsPerSongScreenModel {
  tpsViews: TagsPerSongView[] = [];
  selectedSong = new SelectorItem();
  selectedTag = new SelectorItem();
  selectedType = '';
}
