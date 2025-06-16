import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8688'; // Thay thế bằng API endpoint thực tế của bạn

  constructor(private http: HttpClient) { }

  // Lấy thống kê số lượng đơn hàng và tổng doanh thu
  getStats(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/stats?date=${date}`);
  }

  // Lấy dữ liệu doanh thu theo tháng
  getSalesData(month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/sales?month=${month}`);
  }

  // Lấy top 5 sản phẩm bán chạy
  getTopSellingProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/top-selling`);
  }
}