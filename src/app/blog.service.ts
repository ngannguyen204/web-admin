import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from './class/blog'; 

@Injectable({
  providedIn: 'root' 
})
export class BlogService {
  private apiUrl = 'http://localhost:8688/blog'; 

  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả blog
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  // Lấy blog theo ID
  getBlogById(id: string): Observable<Blog> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Blog>(url);
  }

  // Thêm blog mới (cần xác thực)
  createBlog(blog: Blog, token: string): Observable<Blog> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Gửi dữ liệu blog dưới dạng JSON, bao gồm hình ảnh dưới dạng base64
    return this.http.post<Blog>(this.apiUrl, blog, { headers });
  }

  // Cập nhật blog (cần xác thực)
  updateBlog(id: string, blog: Blog, token: string): Observable<Blog> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Gửi dữ liệu blog dưới dạng JSON, bao gồm hình ảnh dưới dạng base64
    return this.http.put<Blog>(url, blog, { headers });
  }

  // Xóa blog (cần xác thực)
  deleteBlog(id: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(url, { headers });
  }
}