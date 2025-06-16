import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = localStorage.getItem('email') || '';
  newPassword: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  passwordFieldType: string = 'password';
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onResetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.showPopupMessage('Vui lòng nhập đủ các trường!');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showPopupMessage('Mật khẩu xác nhận không khớp!');
      return;
    }

    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      this.showPopupMessage('Token không hợp lệ hoặc đã hết hạn!');
      return;
    }

    this.authService.resetPassword(resetToken, this.newPassword).subscribe(
      (response: any) => {
        console.log('Reset mật khẩu thành công!', response);
        this.showPopupMessage('Reset mật khẩu thành công!');
        localStorage.removeItem('resetToken');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Reset mật khẩu thất bại!', error);
        this.showPopupMessage('Token không hợp lệ hoặc đã hết hạn!');
      }
    );
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}