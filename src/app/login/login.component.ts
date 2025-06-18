import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  passwordFieldType: string = 'password';
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // 👉 Fake login tự động khi vào trang login
    this.fakeLogin();
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    // ✅ GỌI FAKE LOGIN THAY VÌ API
    this.fakeLogin();

    // ❌ CODE GỐC (comment lại, KHÔNG xoá)
    /*
    if (!this.email || !this.password) {
      this.showPopupMessage('Vui lòng nhập đủ các trường!');
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        console.log('Đăng nhập thành công!', response);

        // Lưu token vào localStorage
        localStorage.setItem('token', response.token);

        // Lưu thông tin người dùng vào localStorage
        const userData = {
          username: response.username || 'Admin',
          role: response.role || 'Admin'
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Chuyển hướng đến trang dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Đăng nhập thất bại!', error);
        this.showPopupMessage('Email hoặc mật khẩu không đúng!');
      }
    );
    */
  }

  fakeLogin() {
    const fakeToken = 'FAKE-TOKEN-FOR-DEV';
    localStorage.setItem('token', fakeToken);

    const userData = {
      username: 'DevUser',
      role: 'Admin'
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    this.router.navigate(['/dashboard']);
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
