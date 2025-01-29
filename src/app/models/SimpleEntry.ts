import {DictionarySource} from './DictionarySource';
import {PartOfSpeech} from './PartOfSpeech';

export class SimpleEntry {

  id = 0;
  dictionarySource: DictionarySource = DictionarySource.MURSHID;
  hindi = '';
  urdu = '';
  latin = '';
  partOfSpeech = PartOfSpeech.Noun;
  meaning = '';
}
