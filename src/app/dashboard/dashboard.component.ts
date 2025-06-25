import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface MonthlyData {
  month: string;
  orders: number;
  revenue: number;
}

interface Stats {
  visits: number;
  orders: number;
  revenue: number;
  monthlyData: MonthlyData[];
}

@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  isLoading = true;
  stats: Stats = {
    visits: 0,
    orders: 0,
    revenue: 0,
    monthlyData: []
  };
  salesData: any[] = [];
  topSellingProducts: any[] = [];
  salesChart: Chart | null = null;

  months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  showYearlyView = true;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router 
  ) {
    Chart.register(...registerables);
    const currentYear = new Date().getFullYear();
    this.years = [currentYear - 1, currentYear, currentYear + 1];
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.loadDashboardData();
        } else {
          this.router.navigate(['/login']); 
        }
      },
      error: (err) => {
        console.error('Error checking auth state:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.salesChart) {
      this.salesChart.destroy();
    }
  }

  loadDashboardData(): void {
    console.log('Loading dashboard data...');
    this.isLoading = true;
    
    this.stats = { 
      visits: 0, 
      orders: 0, 
      revenue: 0, 
      monthlyData: [] 
    };
    this.salesData = [];
    this.topSellingProducts = [];

    this.dashboardService.getYearlyStats(this.selectedYear).subscribe({
      next: stats => {
        console.log('Yearly stats loaded:', stats);
        this.stats = stats;
        this.checkLoadingComplete();
      },
      error: err => {
        console.error('Failed to load yearly stats:', err);
        this.isLoading = false;
      }
    });

    if (!this.showYearlyView) {
      this.dashboardService.getMonthlySalesData(this.selectedMonth, this.selectedYear)
        .subscribe(data => {
          this.salesData = data;
          this.checkLoadingComplete();
        });
    }

    this.dashboardService.getTopSellingProducts().subscribe(products => {
      this.topSellingProducts = products;
      this.checkLoadingComplete();
    });
  }

  private checkLoadingComplete(): void {
    const yearlyLoaded = this.showYearlyView && this.stats.monthlyData.length > 0;
    const monthlyLoaded = !this.showYearlyView && this.salesData.length > 0;
    const productsLoaded = this.topSellingProducts.length > 0;
    
    if ((yearlyLoaded || monthlyLoaded) && productsLoaded) {
      this.isLoading = false;
      this.renderChart();
    }
  }

  private renderChart(): void {
    // Đảm bảo hủy chart cũ trước khi tạo mới
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    // Kiểm tra canvas có tồn tại không
    if (!this.salesChartCanvas?.nativeElement) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    if (this.showYearlyView) {
      this.renderYearlyChart(ctx);
    } else {
      this.renderMonthlyChart(ctx);
    }
  }

  private renderYearlyChart(ctx: CanvasRenderingContext2D): void {
    this.salesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.stats.monthlyData.map(item => item.month),
        datasets: [
          {
            label: 'Orders',
            data: this.stats.monthlyData.map(item => item.orders),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            yAxisID: 'y'
          },
          {
            label: 'Revenue',
            data: this.stats.monthlyData.map(item => item.revenue),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            yAxisID: 'y1',
            type: 'line'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Yearly Performance - ${this.selectedYear}`
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Number of Orders'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Revenue (VND)'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }

  private renderMonthlyChart(ctx: CanvasRenderingContext2D): void {
    this.salesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.salesData.map(item => `${item.day}/${this.selectedMonth}`),
        datasets: [{
          label: 'Daily Revenue',
          data: this.salesData.map(item => item.revenue),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Monthly Revenue - ${this.monthNames[this.selectedMonth - 1]} ${this.selectedYear}`
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (VND)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Day of Month'
            }
          }
        }
      }
    });
  }

  toggleView(): void {
    this.showYearlyView = !this.showYearlyView;
    this.loadDashboardData();
  }

  onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedMonth = parseInt(select.value);
    if (!this.showYearlyView) {
      this.loadDashboardData();
    }
  }

  onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(select.value);
    this.loadDashboardData();
  }
}