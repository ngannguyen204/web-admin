import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-code',
  standalone: false,
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.css']
})
export class ConfirmCodeComponent {
  username: string = '';
  code: string = '';
  rememberMe: boolean = false;
  codeFieldType: string = 'password'; // Mặc định ẩn code
  correctCode: string = '123456'; // Giả lập mã xác nhận đúng (thay thế bằng API thực tế)

  constructor(private router: Router) {}

  // Chuyển đổi hiển thị code
  toggleCodeVisibility() {
    this.codeFieldType = this.codeFieldType === 'password' ? 'text' : 'password';
  }

  // Xử lý xác nhận code
  onConfirmCode() {
    console.log('Username:', this.username);
    console.log('Code:', this.code);
    console.log('Remember Me:', this.rememberMe);

    if (this.code === this.correctCode) {
      localStorage.setItem('username', this.username); // Lưu tên đăng nhập
      this.router.navigate(['/reset-password']); // Điều hướng đến trang reset mật khẩu
    } else {
      alert('Mã xác nhận không đúng!');
    }
  }
}
