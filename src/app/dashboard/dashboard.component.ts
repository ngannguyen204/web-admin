import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedMonth: number = new Date().getMonth() + 1; // Mặc định tháng hiện tại
  currentDate: string = new Date().toISOString().split('T')[0]; // Ngày hôm nay
  salesData: any[] = []; // Dữ liệu biểu đồ
  topProducts: any[] = []; // 10 sản phẩm bán chạy nhất
  stats: any = {}; // Lượt truy cập, đơn hàng, doanh thu
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1); // Danh sách tháng 1-12
  chartInstance: Chart | undefined; // Lưu trữ biểu đồ để tránh vẽ đè

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStats(); // Lấy thống kê
    this.fetchData();  // Lấy dữ liệu bảng & biểu đồ
  }

  fetchStats() {
    this.http.get(`API_ENDPOINT/stats?date=${this.currentDate}`).subscribe((data: any) => {
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
      this.topProducts = [];
      this.destroyChart(); // Xóa biểu đồ khi không có dữ liệu
      return;
    }

    interface Product {
      id: number;
      name: string;
      price: number;
      revenue: number;
      quantity: number;
      category: string;
    }

    this.http.get(`API_ENDPOINT/sales?month=${this.selectedMonth}`).subscribe((data: any) => {
      this.salesData = data.chartData;

      this.topProducts = data.topProducts
        .sort((a: Product, b: Product) => b.revenue - a.revenue)
        .slice(0, 10);

      this.renderChart(); // Cập nhật biểu đồ khi có dữ liệu mới
    });
  }

  renderChart() {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Xóa biểu đồ cũ trước khi vẽ mới
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
    this.fetchData(); // Tải dữ liệu mới khi thay đổi tháng
  }
}
