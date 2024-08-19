import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Accessory } from 'src/app/interfaces/Accessory';
import { Image } from 'src/app/interfaces/Image';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnDestroy {
  newVehicleForm;
  serverUrl: string = environment.serverUrl;

  uploadSub!: Subscription;

  newFiles: any[] = [];

  // FormControl to bind the selected year
  yearControl = new FormControl();

  // Example: Limit selectable years from 1900 to the current year
  yearFilter = (date: Date | null): boolean => {
    const year = (date || new Date()).getFullYear();
    return year >= 1900 && year <= new Date().getFullYear();  // Allow years from 1900 to current
  };

  constructor(
    public dialogRef: MatDialogRef<AddVehicleComponent>, private fb: FormBuilder,
    private api: ApiService, private snackbar: MatSnackBar) {
    this.newVehicleForm = this.fb.group({
      regNo: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      modelYear: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],  // Ensure valid year
      millage: [null, [Validators.required, Validators.min(0)]],  // Positive millage
      colour: ['', Validators.required],
      vin: ['', [Validators.required, Validators.minLength(5)]],
      retailPrice: [null, [Validators.required, Validators.min(0)]],  // Ensure valid price
      costPrice: [null, [Validators.required, Validators.min(0)]],  // Ensure valid price
      accessories: this.fb.array([]),  // Initialize empty FormArray for accessories
      images: this.fb.array([])  // Initialize empty FormArray for images
    });
  }

  // Helper to access accessories FormArray
  get accessories(): FormArray {
    return this.newVehicleForm.get('accessories') as FormArray;
  }

  // Helper to access images FormArray
  get images(): FormArray {
    return this.newVehicleForm.get('images') as FormArray;
  }

  // Add a new accessory dynamically
  addAccessory(accessory: Accessory = { name: '', description: '' }): void {
    this.accessories.push(this.fb.group(accessory));
  }

  // Remove accessory
  removeAccessory(index: number): void {
    this.accessories.removeAt(index);
  }

  // Add a new image dynamically
  addImage(image: Image): void {
    this.images.push(this.fb.group(image));
  }

  // Remove image
  removeImage(image: Image, index: number): void {
    this.api.delete(`/file/${image['_id']}`)
      .subscribe({
        next: (response: any) => {
          this.images.removeAt(index);
          this.snackbar.open(response.message, 'Ok', { duration: 3000 })
        },
        error: (err: any) => console.log(err)
      })
  }

  // Child Date Picker
  onYearSelected(year: number) {
    this.newVehicleForm.get('modelYear')?.setValue(year);
  }

  // File Upload
  getFileDetails(files: FileList) {
    this.newFiles = Array.from(files);
    this.newFiles = this.filterExtraImages(this.newFiles);

    if (this.newFiles.length < 1) {
      this.snackbar.open('The number of images must be 3 or fewer.', 'Ok', { duration: 3000 })
      return;
    }

    const formData: FormData = new FormData();

    // Loop through the FileList and append each file to FormData
    for (let i = 0; i < this.newFiles.length; i++) {
      formData.append('files', this.newFiles[i], this.newFiles[i].name);
    }

    this.uploadSub = this.api.post('/upload', formData).subscribe({
      next: (res: any) => {
        for (const file of res['file']) {
          this.addImage({
            name: file.originalname,
            path: `${this.serverUrl}/file/${file.filename}`,
            _id: file['id']
          });
        }
      },
      error: err => console.log(err),
    })
  }

  filterExtraImages(newImages: any) {
    // Calculate how many items are needed to make this.images have 3 items
    const itemsNeeded = 3 - this.images.length;

    // If newImages has more items than needed, pop the extra ones from newImages
    while (newImages.length > itemsNeeded) {
      newImages.pop();
    }

    return newImages;
  }

  submit(): void {
    if (this.newVehicleForm.invalid) return;

    if (this.images.length > 3) {
      this.snackbar.open('The number of images must be 3 or fewer.', 'Ok', { duration: 3000 })
      return;
    }

    this.dialogRef.close(this.newVehicleForm.value);
  }

  cancel(): void {
    this.newFiles.forEach((image: Image, index: number) => {
      this.removeImage(image, index);
    });

    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
  }
}
