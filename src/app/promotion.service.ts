import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';import { Observable } from 'rxjs';
import { Promotion } from './class/promotion';
import { tap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = 'http://localhost:8688/promotion'; 

  constructor(private http: HttpClient) {}

  getAllPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getPromotionById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  updatePromotion(id: string, promotion: Promotion, headers: HttpHeaders): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}`, promotion, { headers }).pipe(
      tap((response: Promotion) => {
        console.log('Phản hồi từ API khi cập nhật:', response);
      }),
      catchError(error => {
        console.error('Lỗi khi cập nhật khuyến mãi:', error);
        throw error;
      })
    );
  }

createPromotion(promotion: Promotion, headers: HttpHeaders): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, promotion, { headers });
}
  deletePromotion(id: string): Observable<any> {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token không tồn tại');
    }

    // Thêm token vào header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}