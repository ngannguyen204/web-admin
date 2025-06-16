import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8688/order/all';

  constructor(private http: HttpClient) {}

  // Hàm để lấy token từ localStorage
  private getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  // Lấy tất cả đơn hàng
  getAllOrders(): Observable<any[]> {
    const headers = this.getAuthHeader();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const headers = this.getAuthHeader();
    return this.http.put(`${this.apiUrl}/${orderId}`, { order_status: status }, { headers });
  }
}