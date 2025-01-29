import {PartOfSpeech} from './PartOfSpeech';
import {Accidence} from './Accidence';

export class Inflected {
  inflectedHindi = '';
  inflectedHindiIndex = 0;
  masterDictionaryId = 0;
  masterDictionaryIndex = 0;
  masterDictionaryHindi = '';
  partOfSpeech = PartOfSpeech.Noun;
  inflectedUrdu = '';
  inflectedUrduStripped = '';
  accidences: Accidence[] = [];
  hideCanonical = false;
  inflectedRomanized = '';
  irregular = false;
}
