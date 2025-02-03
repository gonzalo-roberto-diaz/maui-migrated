import {SelectorItem} from './SelectorItem';
import {InflectionTableItem} from "./InflectionTableItem";

export class InflectionTableModel {
  // urlKey = '';
  message = '';
  //the SelectorItem currently selected in the interface's select control, and to be used by page in general
  selectedItem =  new SelectorItem();
  map: InflectionTableItem[] = [];


  //the query substring to search for song key field
  searchQuery: string = '';
}
