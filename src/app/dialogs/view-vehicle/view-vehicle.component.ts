import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss']
})
export class ViewVehicleComponent {
  selectedImage: number = 0;

  constructor(public dialogRef: MatDialogRef<ViewVehicleComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

}
