import {InflectionTableItemType} from './InflectionTableItemType';
import {InflectedItem} from './InflectedItem';
import {Inflected} from './Inflected';
import {InflectedViewFlat} from './InflectedViewFlat';

export class InflectionTableItem {
  tableItemType = InflectionTableItemType.COMMENT;
  text = '';

  index?: number;

  position?: number;

  inflectedList?: InflectedViewFlat[];

  indexes?: number[];

}
