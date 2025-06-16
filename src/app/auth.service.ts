import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Thêm import tap

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8688/authAdmin'; // URL cơ sở cho các API

  constructor(private http: HttpClient) {}

  // Đăng nhập
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.token) {
          // Lưu token vào localStorage
          localStorage.setItem('authToken', response.token);
          console.log('Token đã được lưu:', response.token);
        }
      })
    );
  }

  // Quên mật khẩu
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // Xác nhận mã code
  confirmCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-code`, { email, code });
  }

  // Đặt lại mật khẩu
  resetPassword(resetToken: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { resetToken, newPassword });
  }

  // Đăng xuất (nếu cần)
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}