import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SongDB} from '../../models/SongDB';
import {SongsService} from '../../services/songs.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {WordUtils} from '../../utils/WordUtils';
import {TagView} from '../../models/TagView';
import {TagsService} from '../../services/tags.service';
import {TranslirerationService} from '../../services/translireration.service';
import {of, pipe} from 'rxjs';
import {catchError} from 'rxjs/operators';



@Component({
  selector: 'app-edit-song',
  imports: [ CommonModule, MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule, ReactiveFormsModule, MatTabsModule],
  templateUrl: './edit-song.component.html',
  styleUrl: './edit-song.component.scss'
})
export class EditSongComponent {
  songForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private songsService: SongsService,

    private transliterationService: TranslirerationService,

    private tagsService: TagsService,
    private dialogRef: MatDialogRef<EditSongComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SongDB,
  ) {
    this.songForm = this.fb.group({
      uuid: [data.uuid], // Hidden primary key
      bolly_name: [data.bolly_name, Validators.required],
      url_key: [data.url_key, Validators.required],
      hindi_title: [data.hindi_title, Validators.required],
      urdu_title: [data.urdu_title, Validators.required],
      latin_title: [data.latin_title, Validators.required],
      video_url: [data.video_url],
      release_date: [data.release_date ? new Date(data.release_date).toISOString().split('T')[0] : ''],

      description: [data.description],
      active: [data.active]
    });
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      const updatedSong: SongDB = this.songForm.value;
      this.songsService.updateSong(updatedSong).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => this.errorMessage = error.message
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  fixUrduTitle(urduInputElement: HTMLInputElement, hindiInputElement: HTMLInputElement, ){
    const urduValue = urduInputElement.value || '';
    const hindiValue = hindiInputElement.value || '';

    const fixedValue = WordUtils.hyphenateUrdu(hindiValue, urduValue);
    this.songForm.controls['urdu_title'].setValue(fixedValue);
  }

  linkify (descriptionElement: HTMLTextAreaElement): void {
    const descriptionValue = descriptionElement.value || '';
    this.tagsService.selectAll().subscribe(tags => {
      const fixedValue = this.songsService.linkifyTags(descriptionValue, tags);
      this.songForm.controls['description'].setValue(fixedValue);
    });
  }

  hindiToLatin (hindiTitleElement: HTMLInputElement): void {
    const hindiTitleValue = hindiTitleElement.value || '';
    this.transliterationService.latinFromHindi(hindiTitleValue)
      .pipe(
        catchError(err => {
          this.songForm.controls['latin_title'].setValue("ERROR");
          return of("");
        })
      ).subscribe(result =>
       this.songForm.controls['latin_title'].setValue(result)
      );
  }

  hindiToUrdu (hindiTitleElement: HTMLInputElement): void {
    const hindiTitleValue = hindiTitleElement.value || '';
    this.transliterationService.hindiToUrdu(hindiTitleValue)
      .pipe(
        catchError(err => {
          this.songForm.controls['urdu_title'].setValue("ERROR");
          return of("");
        })
      ).subscribe(result =>
      this.songForm.controls['urdu_title'].setValue(result)
    );
  }
}

