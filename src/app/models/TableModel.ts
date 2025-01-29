import {SimpleEntry} from './SimpleEntry';
import {PartOfSpeech} from './PartOfSpeech';

export class TableModel {
  hindi = '';
  morphology = '';
  meaning = '';
  masterHindiSubstring = '';
  masterUrduSubstring = '';
  partOfSpeech = PartOfSpeech.None;
  entries: SimpleEntry[] = [];
}
