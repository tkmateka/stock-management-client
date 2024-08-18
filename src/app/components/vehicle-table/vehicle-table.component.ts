import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Vehicle {
  make: string,
  cost: number,
  millage: number,
  modelYear: number,
  image: string,
  model: string,
}


@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss']
})
export class VehicleTableComponent implements OnChanges {
  @Input() vehicles: any;

  enableActions: boolean = false;

  displayedColumns: string[] = ['image', 'make', 'model', 'modelYear', 'cost', 'millage'];
  dataSource!: MatTableDataSource<Vehicle[]>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicles']) {
      const data = changes['vehicles'].currentValue.map((row: any) => {
        return {
          make: row.make,
          cost: row.costPrice,
          millage: row.millage,
          modelYear: row.modelYear,
          image: row.images[0].path,
          model: row.model,
        }
      });

      this.dataSource = new MatTableDataSource(data);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
