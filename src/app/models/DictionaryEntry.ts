import {DictionarySource} from './DictionarySource';
import {DictionaryKey} from './DictionaryKey';
import {PartOfSpeech} from './PartOfSpeech';

export class DictionaryEntry {
  dictionaryKey = new  DictionaryKey();

  hindiWord = '';

  wordIndex = '';

  partOfSpeech = PartOfSpeech.Noun;

  meaning = '';

  dictionarySource = DictionarySource.MURSHID;

}
