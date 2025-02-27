import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {SongsService} from '../../services/songs.service';
import {SongDB} from '../../models/SongDB';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {CommonModule} from '@angular/common';
import {WordUtils} from '../../utils/WordUtils';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-insert-song',
  imports: [ MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  CommonModule, MatIconModule],
  templateUrl: './insert-song.component.html',
  styleUrls: ['./insert-song.component.css']
})
export class InsertSongComponent {
  songForm: FormGroup;

  errorMessage: string | null = null; // Holds error message

  constructor(
    private fb: FormBuilder,
    private songsService: SongsService,
    private dialogRef: MatDialogRef<InsertSongComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.songForm = this.fb.group({
      bolly_name: ['', Validators.required],
      hindi_title: ['', Validators.required],
      urdu_title: ['', [Validators.required, this.noSpacesValidator]],
      video_url: ['', Validators.required],
      release_date: ['', Validators.required]
    });
  }

  // Custom Validator to disallow spaces
  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    return control.value && /\s/.test(control.value) ? { noSpaces: true } : null;
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      const newSong: SongDB = this.songForm.value;
      this.errorMessage = null; // Reset error before submission

      this.songsService.createSongAndTemplate(newSong).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => this.errorMessage = error.message // Capture error message
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Just close the dialog
  }

  fixUrduTitle(urduInputElement: HTMLInputElement, hindiInputElement: HTMLInputElement, ){
    const urduValue = urduInputElement.value || '';
    const hindiValue = hindiInputElement.value || '';

    const fixedValue = WordUtils.hyphenateUrdu(hindiValue, urduValue);
    this.songForm.controls['urdu_title'].setValue(fixedValue);
  }
}
