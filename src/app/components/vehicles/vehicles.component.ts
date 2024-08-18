import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AddVehicleComponent } from 'src/app/dialogs/add-vehicle/add-vehicle.component';
import { Pagination } from 'src/app/interfaces/Pagination';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent {
  vehicles$!: Observable<any>;
  paginationConfig: Pagination = {
    page: 1,
    limit: 2,
    sort: 'dateCreated',
    order: 'asc'
  }
  
  orderOptions: string[] = ['asc', 'desc'];
  sortOptions: string[] = ['dateCreated', 'make', 'model', 'modelYear', 'cost', 'millage'];

  constructor(private api: ApiService, public dialog: MatDialog) {
    // Directly assign the observable returned by the API to the property
    this.vehicles$ = this.getDashboardData();
  }

  handlePageEvent(e: PageEvent) {
    this.paginationConfig['page'] = e.pageIndex + 1;
    this.vehicles$ = this.getDashboardData();
  }

  addNewVehicle(e: string) {
    console.log(e)

    const dialogRef = this.dialog.open(AddVehicleComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  getDashboardData(): Observable<any> {
    return this.api.post('/get_vehicles', this.paginationConfig);
  }
}
