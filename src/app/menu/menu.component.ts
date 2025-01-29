import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})


export class MenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  async dictionarySelected() {
    await this.router.navigate(['/dictionary']);
  }

  async songCommandsSelected() {
    await this.router.navigate(['/song-commands']);
  }

  async songIngestionSelected() {
    await this.router.navigate(['/song-ingestion']);
  }

  async inflectionTableSelected() {
    await this.router.navigate(['/inflection-table']);
  }


  async songValidationSelected() {
    await this.router.navigate(['/song-validation']);
  }

  async inflectedSelected() {
    await this.router.navigate(['/inflected']);
  }

  async allTagsSelected() {
    await this.router.navigate(['/all-tags']);
  }

  async tagsPerSongSelected() {
    await this.router.navigate(['/tags-per-song']);
  }


  async transliterationSelected() {
    await this.router.navigate(['/transliteration']);
  }

  async inputSelected() {
    await this.router.navigate(['/']);
  }

  async songInputSelected() {
    await this.router.navigate(['/song-input']);
  }

}
