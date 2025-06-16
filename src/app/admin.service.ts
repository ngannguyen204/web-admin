import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8688/admin'; // Thay đổi URL API của bạn

  constructor(private http: HttpClient) {}

  getAdminById(id: string): Observable<any> {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Tạo headers với token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Gửi request với headers
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }
}