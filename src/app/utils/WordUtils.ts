export class WordUtils {

  /**
   * removes the spaces (if any) inside an Urdu string, using a Hindi string as a reference.
   * If the Hindi string contains spaces, a '-' is used, otherwise a '~' is used
   * @param hindi   the reference Hindi string
   * @param urdu    the Urdu string to be changed
   */
  public static hyphenateUrdu(hindi: string, urdu: string){
      if (/\s/.test(hindi)) {
        urdu = urdu.replace(/\s/g, '-');
      } else {
        urdu = urdu.replace(/\s/g, '~');
      }
      return urdu;
  }
}
