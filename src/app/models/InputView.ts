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
  treat_as_invariable = false;

  constructor() {
    this.show_canonical = true;
    this.accidence = [];
    this.part_of_speech = PartOfSpeech.None;
    this.index = 0;
  }




}
