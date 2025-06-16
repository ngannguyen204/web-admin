import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isConfirmStep: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (!this.email.trim()) {
      this.showPopupMessage('Vui lòng nhập đủ các trường!');
      return;
    }

    this.authService.forgotPassword(this.email).subscribe(
      (response: any) => {
        console.log('Email sent to:', this.email);
        this.showPopupMessage('Email đã được gửi thành công!');
        this.router.navigate(['/confirm-code']);
      },
      (error) => {
        console.error('Gửi email thất bại!', error);
        this.showPopupMessage('Email không tồn tại!');
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