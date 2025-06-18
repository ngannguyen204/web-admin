import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone:false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = localStorage.getItem('email') || '';
  newPassword: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  passwordFieldType: string = 'password';

  constructor(private router: Router, private authService: AuthService) {}

  onResetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.showPopupMessage('Please fill in all fields!');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showPopupMessage('Passwords do not match!');
      return;
    }

    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      this.showPopupMessage('Invalid or expired token!');
      return;
    }

    this.authService.resetPassword(resetToken, this.newPassword).subscribe({
      next: () => {
        this.showPopupMessage('Password reset successfully!');
        localStorage.removeItem('resetToken');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Password reset failed:', error);
        this.showPopupMessage('Failed to reset password. Please try again!');
      }
    });
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}