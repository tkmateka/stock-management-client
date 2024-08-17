import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent {
  vehicles$!: Observable<any>;

  constructor(private api: ApiService) {
    // Directly assign the observable returned by the API to the property
    this.vehicles$ = this.getDashboardData();
  }

  getDashboardData(): Observable<any> {
    const body = {
      page: 1, 
      limit: 10, 
      sort: 'dateCreated', 
      order: 'asc'
    }

    return this.api.post('/get_vehicles', body);
  }
}
