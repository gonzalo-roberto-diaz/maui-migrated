export class InflectedView {
  master_dictionary_id = 0;
  key_inflected_hindi = '';

  part_of_speech =  '';

  accidenceString = '';
  accidence: string[] | null = [];


  key_inflected_hindi_index = 0;
  inflected_hindi = '';
  inflected_hindi_index = 0;
  inflected_urdu = '';
  inflected_romanized = '';

  override_accidence_validation = false;
}
