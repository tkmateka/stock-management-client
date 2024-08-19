import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
export class DashboardComponent implements OnDestroy {
  userInfo: any = null;
  dashboardData$!: Observable<any>;
  dashboardSub!: Subscription;
  previousYears:ChartData = {
    labels: [],
    data: []
  };

  constructor(private api: ApiService) {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    this.updateTable();

    // Remove after testing
    this.dashboardSub = this.dashboardData$.subscribe((data:any) => {
      data.previousYearsData.forEach((year:any) => {
        this.previousYears.labels.push(year.year);
        this.previousYears.data.push(year.carsAdded);
      });
    })
  }

  updateTable() {
    // Directly assign the observable returned by the API to the property
    this.dashboardData$ = this.getDashboardData();
  }

  getDashboardData(): Observable<any> {
    return this.api.get('/get_dashboard_data');
  }

  ngOnDestroy() {
    this.dashboardSub?.unsubscribe();
  }
}
