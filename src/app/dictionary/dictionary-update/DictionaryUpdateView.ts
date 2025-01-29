import {PartOfSpeech} from "../../models/PartOfSpeech";

export class DictionaryUpdateView {
  master_dictionary_id = 0;
  meaning = 0;
  hindi_word = '';
  urdu_word = '';
  part_of_speech: PartOfSpeech = PartOfSpeech.Noun;
  romanized_word = '';
}
