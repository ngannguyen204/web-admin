import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from './class/admin';
import { Customer } from './class/customer';
@Injectable({
  providedIn: 'root'
})
export class AdminAccountService {
  private apiUrl = 'http://localhost:8688'; // Thay đổi URL tùy theo backend của bạn

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/admin`, { headers: this.getHeaders() });
  }

  getAdminById(id: string): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/admin/${id}`, { headers: this.getHeaders() });
  }

  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/admin`, admin, { headers: this.getHeaders() });
  }

  updateAdmin(id: string, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/admin/${id}`, admin, { headers: this.getHeaders() });
  }

  deleteAdmin(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/${id}`, { headers: this.getHeaders() });
  }

  getCustomers(headers: HttpHeaders): Observable<{ success: boolean, customers: Customer[] }> {
    return this.http.get<{ success: boolean, customers: Customer[] }>(`${this.apiUrl}/customer`, { headers });
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customer/${id}`, { headers: this.getHeaders() });
  }

  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customer/${id}`, customer, { headers: this.getHeaders() });
  }

}