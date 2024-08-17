import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnChanges {
  @Input() labels: number[] = [];
  @Input() data: number[] = [];

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'bar'>['data'];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['labels'] || changes['data']) {
      this.barChartData = {
        labels: changes['labels'].currentValue,
        datasets: [
          { data: changes['data'].currentValue, label: 'Cars Added In Previous Years' }
        ]
      };
    }
  }

}
