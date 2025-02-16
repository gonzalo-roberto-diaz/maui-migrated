import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatTab, MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTabGroup, MatTab],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'murshid-admin-ui';

  constructor(private router: Router) { }



  onTabChange(event: MatTabChangeEvent): void {
    console.log(event.tab.textLabel);
    switch (event.tab.textLabel) {
      case "Word Input":
        this.router.navigate(['/word-input']);
        break;
      case "Dictionary":
        this.router.navigate(['/dictionary']);
        break;
      case "Song Input":
        this.router.navigate(['/song-input']);
        break;
      case "Simple Commands":
        this.router.navigate(['/song-commands']);
        break;
      case "Song Ingestion":
        this.router.navigate(['/song-ingestion']);
        break;
      case "Inflection Table":
        this.router.navigate(['/inflection-table']);
        break;
      case "Song Validation":
        this.router.navigate(['/song-validation']);
        break;
      case "Inflected":
        this.router.navigate(['/inflected']);
        break;
      case "All Tags":
        this.router.navigate(['/all-tags']);
        break;
      case "Tags per Song":
        this.router.navigate(['/tags-per-song']);
        break;
      case "Transliteration":
        this.router.navigate(['/transliteration']);
        break;
      default:
        throw new Error('not a known tag label');
    }
  }

}
