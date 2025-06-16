import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-confirm-code',
  standalone: false,
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.css']
})
export class ConfirmCodeComponent {
  email: string = '';
  code: string = '';
  rememberMe: boolean = false;
  codeFieldType: string = 'password';
  showPopup: boolean = false;
  popupMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  toggleCodeVisibility() {
    this.codeFieldType = this.codeFieldType === 'password' ? 'text' : 'password';
  }

  onConfirmCode() {
    this.authService.confirmCode(this.email, this.code).subscribe(
      (response: any) => {
        console.log('Xác nhận mã thành công!', response);
        localStorage.setItem('resetToken', response.resetToken);
        this.showPopupMessage('Xác nhận mã thành công!');
        this.router.navigate(['/reset-password']);
      },
      (error) => {
        console.error('Xác nhận mã thất bại!', error);
        this.showPopupMessage('Mã xác nhận không đúng!');
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