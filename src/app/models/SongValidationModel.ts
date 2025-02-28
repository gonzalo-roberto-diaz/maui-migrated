import {SelectorItem} from './SelectorItem';

export class SongValidationModel {
  url = '';
  messages: string[] = [];

  //the SelectorItem currently selected in the interface's select control, and to be used by page in general
  selectedItem =  new SelectorItem();

  //the query substring to search for song key field
  searchQuery: string = '';
}
