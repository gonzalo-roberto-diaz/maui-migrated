/**
 * an item in the Inflection item which we know to be of the type "INFLECTED_ENTRY,"
 */
export class InflectedItem {
  /**
   * the key of the song
   */
  urlKey = '';

  /**
   * the position in the inflection table
   */
  position  = 0;

  /**
   * the hindi string
   */
  hindi  = '';

  /**
   * the index
   */
  index = 0;

  /**
   * part of the meaning, just ot tell one word from another
   */
  meaning  = '';
}
