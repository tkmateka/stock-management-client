import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

interface ChartData {
  labels: number[], 
  data: number[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userInfo: any = null;
  dashboardData$!: Observable<any>;

  previousYears:ChartData = {
    labels: [],
    data: []
  };

  constructor(private api: ApiService) {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    // Directly assign the observable returned by the API to the property
    this.dashboardData$ = this.getDashboardData();

    // Remove after testing
    this.dashboardData$.subscribe((data:any) => {
      data.previousYearsData.forEach((year:any) => {
        this.previousYears.labels.push(year.year);
        this.previousYears.data.push(year.carsAdded);
      });
    })

  }

  getDashboardData(): Observable<any> {
    return this.api.get('/get_dashboard_data');
  }
}
