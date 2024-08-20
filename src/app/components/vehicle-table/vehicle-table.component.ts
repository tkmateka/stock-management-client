import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from 'src/app/dialogs/confirmation/confirmation.component';
import { UpdateVehicleComponent } from 'src/app/dialogs/update-vehicle/update-vehicle.component';
import { ViewVehicleComponent } from 'src/app/dialogs/view-vehicle/view-vehicle.component';
import { ApiService } from 'src/app/services/api.service';

export interface Vehicle {
  make: string,
  cost: number,
  millage: number,
  modelYear: number,
  image: string,
  model: string,
  actions: string;
}


@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss']
})
export class VehicleTableComponent implements OnChanges, OnDestroy {
  @Input() vehicles: any;
  @Input() showActions: boolean | undefined = false;
  @Output() addNewVehicle: EventEmitter<string> = new EventEmitter();
  @Output() updateTable: EventEmitter<string> = new EventEmitter();

  enableActions: boolean = false;
  vehiclesList: any[] = [];
  displayedColumns: string[] = ['image', 'make', 'model', 'modelYear', 'cost', 'millage', 'actions'];
  dataSource!: MatTableDataSource<Vehicle[]>;

  updateSub!: Subscription;

  constructor(public dialog: MatDialog, private api: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicles']) {
      this.vehiclesList = changes['vehicles'].currentValue;

      const data: any = this.vehiclesList.map((row: any) => {
        return {
          make: row.make,
          cost: row.costPrice,
          millage: row.millage,
          modelYear: row.modelYear,
          image: row.images[0].path,
          model: row.model,
          actions: ''
        }
      });

      this.dataSource = new MatTableDataSource(data);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addVehicle() {
    this.addNewVehicle.emit('Add new Vehicle');
  }

  view(index: number) { 
    this.dialog.open(ViewVehicleComponent, {
      width: '80vw',
      data: this.vehiclesList[index],
    });
  }

  update(index: number) {
    const dialogRef = this.dialog.open(UpdateVehicleComponent, {
      hasBackdrop: false,
      data: this.vehiclesList[index],
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.updateSub = this.api.put(`/update_vehicle`, result).subscribe({
          next: (res) => this.updateTable.emit(),
          error: (err) => console.log(err)
        })
      }
    });
  }

  delete(index: number) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      hasBackdrop: false,
      data: `Are you sure you want to DELETE ${this.vehiclesList[index]['make']}?`,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.delete(`/delete_vehicle_by_id/${this.vehiclesList[index]['_id']}`).subscribe({
          next: (res) => this.updateTable.emit(),
          error: (err) => console.log(err)
        })
      }
    });
  }

  ngOnDestroy() {
    this.updateSub?.unsubscribe();
  }
}
