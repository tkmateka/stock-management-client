import { Component } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent {
  newVehicleForm;

  // FormControl to bind the selected year
  yearControl = new FormControl();

  // Example: Limit selectable years from 1900 to the current year
  yearFilter = (date: Date | null): boolean => {
    const year = (date || new Date()).getFullYear();
    return year >= 1900 && year <= new Date().getFullYear();  // Allow years from 1900 to current
  };

  // tokenSubscription!: Subscription;
  // userInfoSubscription!: Subscription;

  //   {
  //     "name": "watch-4.webp",
  //     "path": "http://localhost:3000/api/file/cce0f8f93bd7a7e861226ceb67e09f4a.jpg"
  // }

  constructor(public dialogRef: MatDialogRef<AddVehicleComponent>, private fb: FormBuilder) {
    this.newVehicleForm = this.fb.group({
      regNo: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      modelYear: [0, [Validators.required, Validators.min(1900)]],  // Ensure valid year
      millage: [null, [Validators.required, Validators.min(0)]],  // Positive millage
      colour: ['', Validators.required],
      vin: ['', Validators.required],
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
  addAccessory(): void {
    this.accessories.push(this.fb.control(''));
  }

  // Remove accessory
  removeAccessory(index: number): void {
    this.accessories.removeAt(index);
  }

  // Add a new image dynamically
  addImage(): void {
    this.images.push(this.fb.group({
      name: '',
      path: ''
    }));
  }

  // Remove image
  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  // Child Date Picker
  onYearSelected(year: number) {
    this.newVehicleForm.get('modelYear')?.setValue(year);
  }

  // File Upload
  getFileDetails(event:any) {
    console.log(event);
  }

  submit(): void {
    if (this.newVehicleForm.invalid) return;

    this.dialogRef.close(this.newVehicleForm.value)
  }
}
