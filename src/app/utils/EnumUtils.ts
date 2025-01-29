import {InputAccidence} from "../models/InputAccidence";
import {PartOfSpeech} from "../models/PartOfSpeech";

export class EnumUtils {
  static accidenceFromString(enumName: string): InputAccidence {
    switch (enumName) {
      case 'MASCULINE':
        return InputAccidence.Masculine;
      case 'FEMININE':
        return InputAccidence.Feminine;
      case 'NONE':
        return InputAccidence.None;

      default:
        throw new Error('string ' + enumName + ' is not a known Accidence');
    }
  }

  static partOfSpeechFromString(enumName: string): PartOfSpeech {
    switch (enumName.toUpperCase()) {
      case '':
      case 'NONE':
        return PartOfSpeech.None;
      case 'NOUN':
        return PartOfSpeech.Noun;
      case 'VERB':
        return PartOfSpeech.Verb;
      case 'ADVERB':
        return PartOfSpeech.Adverb;
      case 'ADJECTIVE':
        return PartOfSpeech.Adjective;
      case 'PARTICLE':
        return PartOfSpeech.Particle;
      case 'VERBAL_PHRASE':
        return PartOfSpeech.VerbalPhrase;
      case 'NOMINAL_PHRASE':
        return PartOfSpeech.NominalPhrase;
      case 'ADJECTIVAL_PHRASE':
        return PartOfSpeech.AdjectivalPhrase;
      case 'ADVERBIAL_PHRASE':
        return PartOfSpeech.AdverbialPhrase;
      case 'COMPOUND_POSTPOSITION':
        return PartOfSpeech.CompoundPostposition;
      case 'CONJUNCTIONAL_PHRASE':
        return PartOfSpeech.ConjunctionalPhrase;
      case 'CONJUNCTION':
        return PartOfSpeech.Conjunction;
      case 'ONOMATOPOEIA':
        return PartOfSpeech.Onomatopoeia;
      case 'PRONOUN':
        return PartOfSpeech.Pronoun;
      case 'PHRASE':
        return PartOfSpeech.Phrase;
      case 'SUFFIX':
        return PartOfSpeech.Suffix;
      case 'MULTI_FUNCTION_WORD':
        return PartOfSpeech.MultiFunctionWord;
      case 'INTERJECTION':
        return PartOfSpeech.Interjection;
      case 'PREFIX':
        return PartOfSpeech.Prefix;
      default:
        throw new Error('string ' + enumName + ' is not a known Part Of Speech');
    }
  }


}
