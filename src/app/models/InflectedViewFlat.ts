import {PartOfSpeech} from './PartOfSpeech';
import {Accidence} from './Accidence';

export class InflectedViewFlat {

  inflectedHindi = '';

  inflectedHindiIndex = 0;

  masterDictionaryId = 0;

  masterDictionaryHindi = '';

  masterDictionaryIndex = 0;

  partOfSpeech = PartOfSpeech.Noun;

  inflectedUrdu = '';

  inflectedUrduStripped = '';

  accidences: Accidence[] = [];

  hideCanonical = false;

  inflectedRomanized = '';

  irregular = false;

  meaning = '';

}

