import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  username = localStorage.getItem('username') || ''; // Lấy username từ localStorage
  newPassword: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  passwordFieldType: string = 'password';

  constructor(private router: Router) {}

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Giả lập lưu mật khẩu mới
    console.log('Mật khẩu mới:', this.newPassword);

    // Chuyển về trang đăng nhập sau khi đặt lại mật khẩu thành công
    this.router.navigate(['/login']);
  }
}
