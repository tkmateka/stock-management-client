import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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

  displayedColumns: string[] = ['image', 'make', 'model', 'modelYear', 'cost', 'millage'];
  dataSource!: Vehicle[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicles']) {
      console.log(changes['vehicles'])
      this.dataSource = changes['vehicles'].currentValue.map((row: any) => {
        return {
          make: row.make,
          cost: row.costPrice,
          millage: row.millage,
          modelYear: row.modelYear,
          image: row.images[0].path,
          model: row.model,
        }
      });
      console.log(this.dataSource)
    }
  }
}
