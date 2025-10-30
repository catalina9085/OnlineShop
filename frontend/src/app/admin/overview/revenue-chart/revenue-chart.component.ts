import {AfterViewInit, Component, effect, input, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdminService} from '../../admin.service';
import {Chart} from 'chart.js';
import {RevenueModel} from '../../domain/revenue.model';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-revenue-chart',
  imports: [
    MatOption,
    MatSelect
  ],
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.scss'
})
export class RevenueChartComponent implements AfterViewInit {
  dailyRevenue=input<RevenueModel[]>([]);
  weeklyRevenue=input<RevenueModel[]>([]);
  monthlyRevenue=input<RevenueModel[]>([]);
  option=signal<string>('daily');

  private chart: Chart | null = null;

  constructor(private adminService:AdminService) {
    effect(()=>{
      if(this.dailyRevenue()){
        this.createChart();
      }
    })
  }

  ngAfterViewInit() {
    this.createChart();
  }

  optionChanged($event:string){
    this.option.set($event);
    this.createChart();
  }

  createChart() {
    let revenue;
    if (this.option() == 'daily') revenue = this.dailyRevenue();
    else if (this.option() == 'weekly') revenue = this.weeklyRevenue();
    else revenue = this.monthlyRevenue();

    const labels = revenue.map(d => d.period);
    const revenues = revenue.map(d => d.revenue);

    const ctx = (document.getElementById('revenueChart') as HTMLCanvasElement).getContext('2d');

    // distruge chart-ul existent dacă există
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue',
          data: revenues,
          borderColor: 'blue',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Revenue' } }
        }
      }
    });
  }
}
