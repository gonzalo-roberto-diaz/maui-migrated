import {Component, OnInit} from '@angular/core';
import {SongsService} from '../services/songs.service';
import {Observable} from 'rxjs';
import {SongDB} from '../models/SongDB';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {InsertSongComponent} from './insert-song/insert-song.component';
import {EditSongComponent} from './edit-song/edit-song.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-all-songs',
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './all-songs.component.html',
  styleUrl: './all-songs.component.scss'
})
export class AllSongsComponent implements OnInit{

  songs$ = new Observable<SongDB[]>();

  constructor(private songsService: SongsService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.findSongsByBollyName('');
  }



  findSongsByBollyName(substring: string){
    this.songs$ = this.songsService.findByBollySubstring(substring);
  }

  findSongsByDescription(substring: string){
    this.songs$ = this.songsService.findByDescriptionSubstring(substring);
  }

  onSearch(event: Event): void{

  }


  openInsertDialog(): void {
    const dialogRef = this.dialog.open(InsertSongComponent, {
      width: '400px',
      disableClose: true // Prevents closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.findSongsByBollyName(''); // Refresh list only if a song was added
      }
    });
  }

  openEditDialog(song: SongDB): void {
    const dialogRef = this.dialog.open(EditSongComponent, {
      width: '1500px',
      maxWidth: 'none',
      data: { ...song }, // Pass song data to edit form
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.findSongsByBollyName(''); // Refresh list after update
    });
  }


}
