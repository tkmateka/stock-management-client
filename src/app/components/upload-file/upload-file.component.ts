import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @Output() emitUrl = new EventEmitter<any>();

  file = new FormControl('');

  maxSizeMB: number = 5;

  @ViewChild('uploadInput', { static: false }) uploadInput!: ElementRef<HTMLInputElement>;

  constructor(private snackbar: MatSnackBar) { }

  triggerFileInput() {
    this.uploadInput.nativeElement.click();
  }

  // Utility function to convert bytes to MB
  bytesToMB(bytes: number): number {
    return bytes / (1024 * 1024);
  }

  uploadFile(event: Event) {
    const input: any = event.target as HTMLInputElement;

    // Check if the number of files exceeds 3
    if (input.files.length > 3) {
      this.snackbar.open('You can only upload a maximum of 3 files.');
      input.value = ''; // Clear the file input
      return;
    }

    for (const file of input.files) {
      const fileSizeMB = this.bytesToMB(file.size);

      // Check if file size exceeds the maximum limit
      if (fileSizeMB > this.maxSizeMB) {
        this.snackbar.open(`File size exceeds the maximum limit of ${this.maxSizeMB} MB.`, 'Ok');
        return;
      }
    }

    this.file.setValue('Testing');
    console.log(this.file)
  }

  getFileDetails(event: any) {
    this.emitUrl.emit(event);
  }
}
