// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { Observable } from 'rxjs';
import { Product } from './class/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8688/product'; // Đổi URL tùy theo backend của bạn

  constructor(private http: HttpClient) { }

  // Hàm lấy token từ localStorage

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    console.log("Token from localStorage:", token);
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  getProductsByAttributes(gender: string, faceshape: string, material: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/filter`, {
      params: { gender, faceshape, material }
    });
  }

  getTopSellingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/top-selling`);
  }

  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/latest`);
  }

  createProduct(product: Product): Observable<Product> {
    const headers = this.getAuthHeaders(); // Lấy headers với token
    return this.http.post<Product>(`${this.apiUrl}`, product, { headers });
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    const headers = this.getAuthHeaders(); // Lấy headers với token
    console.log("Sending update request to:", `${this.apiUrl}/${id}`); // Log URL
    console.log("Request headers:", headers); // Log headers
    console.log("Request body:", product); // Log dữ liệu gửi lên server
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers });
}

  deleteProduct(id: string): Observable<void> {
    const headers = this.getAuthHeaders(); // Lấy headers với token
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}