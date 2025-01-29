import {TagView} from './TagView';

export class AllTagsModel {
  buffer = new TagView();
  searchSubstring = '';
  tags: TagView[] = [];

  constructor() {
    this.buffer = new TagView();
  }
}
