import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
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

  constructor(private api: ApiService) {
    // Directly assign the observable returned by the API to the property
    this.vehicles$ = this.getDashboardData();
  }

  handlePageEvent(e: PageEvent) {
    this.paginationConfig['page'] = e.pageIndex + 1;
    this.vehicles$ = this.getDashboardData();
  }

  getDashboardData(): Observable<any> {
    return this.api.post('/get_vehicles', this.paginationConfig);
  }
}
