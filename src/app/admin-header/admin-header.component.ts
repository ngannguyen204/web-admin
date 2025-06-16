import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  username: string = 'Admin';  // Giá trị mặc định nếu không có dữ liệu
  role: string = 'Admin';      // Giá trị mặc định

  constructor(private router: Router) {}

  ngOnInit() {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.username = user.username || 'Admin'; // Nếu có username, sẽ hiển thị đúng tên
      this.role = user.role || 'Admin';
    }
  }

  logout() {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('userData');
    localStorage.removeItem('token');

    // Chuyển hướng về trang đăng nhập
    this.router.navigate(['/login']);
  }
}