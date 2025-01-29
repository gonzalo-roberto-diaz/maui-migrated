import {InputAccidence} from "./InputAccidence";
import {PartOfSpeech} from "./PartOfSpeech";

export class InputView {
  hindi = '';
  urdu = '';
  latin = '';
  index = 0;
  show_canonical = false;
  accidence: InputAccidence[] = [];
  part_of_speech = PartOfSpeech.Noun;
  meaning = '';
  /**
   * For "... phrases" (verbal, adjectival, etc) indicates whether or not also to create an inflected entry, in
   * addition to the master_dictionary entry. Should be used for one-word (Hindi-hyphenated) phrases
   */
  add_inflected = false;
  treat_as_invariable = false;

  constructor() {
    this.show_canonical = true;
    this.accidence = [];
    this.part_of_speech = PartOfSpeech.None;
    this.index = 0;
    this.add_inflected = false;
  }




}
