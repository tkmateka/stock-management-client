import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Accessory } from 'src/app/interfaces/Accessory';
import { Image } from 'src/app/interfaces/Image';
import { ApiService } from 'src/app/services/api.service';
import { FileUploadsService } from 'src/app/services/file-uploads.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnDestroy {
  newVehicleForm;
  newFiles: any[] = [];
  userInfo;

  serverUrl: string = environment.serverUrl;

  uploadSub!: Subscription;
  // FormControl to bind the selected year
  yearControl = new FormControl();

  // Example: Limit selectable years from 1900 to the current year
  yearFilter = (date: Date | null): boolean => {
    const year = (date || new Date()).getFullYear();
    return year >= 1900 && year <= new Date().getFullYear();  // Allow years from 1900 to current
  };

  constructor(
    public dialogRef: MatDialogRef<AddVehicleComponent>, private fb: FormBuilder, private token: TokenService,
    private api: ApiService, private snackbar: MatSnackBar, private upload: FileUploadsService
  ) {
    this.userInfo = token.getItem('userInfo');

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
  async removeImage(image: Image, index: number) {
    try {
      const response = await this.upload.deleteFileStorage(`/vehicles`, image.name);

      this.images.removeAt(index);
      this.snackbar.open('Image deleted successfully', 'Ok', { duration: 3000 })
    } catch (error) {
      console.log(error)
    }
  }

  // Child Date Picker
  onYearSelected(year: number) {
    this.newVehicleForm.get('modelYear')?.setValue(year);
  }

  // File Upload
  async getFileDetails(files: FileList) {
    this.newFiles = Array.from(files);
    this.newFiles = this.filterExtraImages(this.newFiles);

    if (this.newFiles.length < 1) {
      this.snackbar.open('The number of images must be 3 or fewer.', 'Ok', { duration: 3000 })
      return;
    }

    try {
      const response = await this.upload.uploadFiles(`/vehicles`, files)

      for (const file of response) {
        this.addImage(file);
      }
    } catch (error) {
      console.log(error)
    }
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
