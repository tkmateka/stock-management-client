import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
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
  vehicleSub!: Subscription;
  paginationConfig: Pagination = {
    page: 1,
    limit: 2,
    sort: 'dateCreated',
    order: 'asc'
  }

  orderOptions: string[] = ['asc', 'desc'];
  sortOptions: string[] = ['dateCreated', 'make', 'model', 'modelYear', 'cost', 'millage'];

  constructor(private api: ApiService, public dialog: MatDialog, private snackbar: MatSnackBar) {
    // Directly assign the observable returned by the API to the property
    this.vehicles$ = this.getDashboardData();
  }

  handlePageEvent(e: PageEvent) {
    this.paginationConfig['page'] = e.pageIndex + 1;
    this.vehicles$ = this.getDashboardData();
  }

  addNewVehicle(e: string) {
    const dialogRef = this.dialog.open(AddVehicleComponent, {
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicleSub = this.api.post('/add_vehicle', result).subscribe({
          next: (res: any) => {
            this.snackbar.open(res.message, 'Ok', { duration: 3000 });
            this.vehicles$ = this.getDashboardData();
          },
          error: (err: any) => this.snackbar.open(err.error),
        });
      }
    });
  }

  getDashboardData(): Observable<any> {
    return this.api.post('/get_vehicles', this.paginationConfig);
  }

  ngOnDestroy() {
    if (this.vehicleSub) {
      this.vehicleSub.unsubscribe();
    }
  }
}
