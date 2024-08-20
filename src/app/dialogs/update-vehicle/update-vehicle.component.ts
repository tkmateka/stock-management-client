import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Accessory } from 'src/app/interfaces/Accessory';
import { Image } from 'src/app/interfaces/Image';
import { ApiService } from 'src/app/services/api.service';
import { FileUploadsService } from 'src/app/services/file-uploads.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.scss']
})
export class UpdateVehicleComponent {
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
    public dialogRef: MatDialogRef<UpdateVehicleComponent>, private fb: FormBuilder,
    private api: ApiService, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, private upload: FileUploadsService,
  ) {
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

    // Initialize the form with some data (could come from an API)
    this.populateFormWithVehicleData(data);
  }

  // Populates the form with initial vehicle data
  populateFormWithVehicleData(vehicleData: any): void {
    this.newVehicleForm.patchValue({
      regNo: vehicleData.regNo,
      make: vehicleData.make,
      model: vehicleData.model,
      modelYear: vehicleData.modelYear,
      millage: vehicleData.millage,
      colour: vehicleData.colour,
      vin: vehicleData.vin,
      retailPrice: vehicleData.retailPrice,
      costPrice: vehicleData.costPrice,
    });

    // Populate accessories if any
    if (vehicleData.accessories) {
      const accessoriesArray = this.newVehicleForm.get('accessories') as FormArray;
      vehicleData.accessories.forEach((accessory: any) => {
        accessoriesArray.push(this.fb.group(accessory));
      });
    }

    // Populate images
    if (vehicleData.images) {
      const imagesArray = this.newVehicleForm.get('images') as FormArray;
      vehicleData.images.forEach((image: any) => {
        imagesArray.push(this.fb.group(image));
      });
    }
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
      const response = await this.upload.uploadFiles(`/vehicles/${new Date().getTime()}`, files)

      for (const file of response) {
        this.addImage(file);
      }
    } catch (error) {
      console.log(error)
    }
  }

  filterExtraImages(newImages: any) {
    const images: any[] = newImages;
    // Calculate how many items are needed to make this.images have 3 items
    const itemsNeeded = 3 - this.images.length;

    // If newImages has more items than needed, pop the extra ones from newImages
    while (images.length > itemsNeeded) {
      images.pop();
    }

    return images;
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
