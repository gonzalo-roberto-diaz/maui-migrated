import {SelectorItem} from './SelectorItem';
import {InflectionTableItem} from './InflectionTableItem';

export class InflectionTableModel {
  // urlKey = '';
  message = '';
  selectorItem = new  SelectorItem();
//   map: object[] = [];
  map: {
   [key: string]: InflectionTableItem,
  }[];
}
