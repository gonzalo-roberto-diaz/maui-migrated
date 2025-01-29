import { Injectable } from '@angular/core';
import {TableModel} from "../models/TableModel";
import {InputModel} from "../models/InputModel";
import {InputView} from "../models/InputView";
import {SongInputView} from "../models/SongInputView";
import {SongInputModel} from "../models/SongInputModel";
import {SongIngestionModel} from "../models/SongIngestionModel";
import {SongValidationModel} from "../models/SongValidationModel";
import {InflectedModel} from "../models/InflectedModel";
import {TransliterationModel} from "../models/TransliterationModel";
import {InflectionTableModel} from "../models/InflectionTableModel";
import {AllTagsModel} from "../models/AllTagsModel";
import {TagsPerSongScreenModel} from "../models/TagsPerSongScreenModel";

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  public tableModel: TableModel;
  public inputModel: InputModel;
  public songInputModel : SongInputModel;
  public songIngestionModel: SongIngestionModel;
  public inflectionTableModel: InflectionTableModel;
  public songValidationModel: SongValidationModel;
  public inflectedModel: InflectedModel;
  public transliterationModel: TransliterationModel;
  public allTagsModel: AllTagsModel;
  public tagsPerSongScreenModel: TagsPerSongScreenModel;

  constructor() {
    this.tableModel = new TableModel();
    this.inputModel = new InputModel();
    this.inputModel.inputView = new InputView();
    this.songInputModel = new SongInputModel();
    this.songInputModel.songInputView = new SongInputView();
    this.songIngestionModel = new SongIngestionModel();
    this.inflectionTableModel = new InflectionTableModel();
    this.songValidationModel = new SongValidationModel();
    this.inflectedModel = new InflectedModel();
    this.transliterationModel = new TransliterationModel();
    this.allTagsModel = new AllTagsModel();
    this.tagsPerSongScreenModel = new TagsPerSongScreenModel();
  }
}
