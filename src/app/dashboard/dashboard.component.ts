import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedMonth: number = new Date().getMonth() + 1;
  currentDate: string = new Date().toISOString().split('T')[0];
  salesData: any[] = [];
  topSellingProducts: any[] = [];
  stats: any = {};
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  chartInstance: Chart | undefined;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchData();
    this.fetchTopSellingProducts();
  }

  fetchStats() {
    this.dashboardService.getStats(this.currentDate).subscribe((data: any) => {
      this.stats = {
        visits: data.visits,
        orders: data.orders,
        revenue: data.revenue
      };
    });
  }

  fetchData() {
    const currentMonth = new Date().getMonth() + 1;
    if (this.selectedMonth > currentMonth) {
      this.salesData = [];
      this.destroyChart();
      return;
    }

    this.dashboardService.getSalesData(this.selectedMonth).subscribe((data: any) => {
      this.salesData = data.chartData;
      this.renderChart();
    });
  }

  fetchTopSellingProducts() {
    this.dashboardService.getTopSellingProducts().subscribe((data: any) => {
      this.topSellingProducts = data;
    });
  }

  renderChart() {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.destroyChart();

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.salesData.map(item => item.day),
        datasets: [{
          label: 'Tổng doanh thu',
          data: this.salesData.map(item => item.totalRevenue),
          borderColor: '#063B06',
          fill: true,
          backgroundColor: 'rgba(6, 59, 6, 0.2)'
        }]
      }
    });
  }

  destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = undefined;
    }
  }

  onMonthChange(event: any) {
    this.selectedMonth = parseInt(event.target.value, 10);
    this.fetchData();
  }
}