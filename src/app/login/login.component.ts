import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  passwordFieldType: string = 'password';

  constructor(private router: Router) {}

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    console.log('Đang đăng nhập với:', this.username, this.password);
    
    // Giả lập kiểm tra tài khoản (thay bằng API nếu có backend)
    const correctUsername = 'admin';
    const correctPassword = '123456';

    if (this.username === correctUsername && this.password === correctPassword) {
      console.log('Đăng nhập thành công! Chuyển hướng đến Dashboard.');
      this.router.navigate(['/dashboard']); // Điều hướng đến Dashboard
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  }
}
