import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-confirm-code',
  standalone:false,
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.css']
})
export class ConfirmCodeComponent {
  email: string = localStorage.getItem('email') || '';
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
    if (!this.code.trim()) {
      this.showPopupMessage('Please enter the verification code!');
      return;
    }

    this.authService.confirmCode(this.email, this.code).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.showPopupMessage('Code verified successfully!');
          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 1500);
        } else {
          this.showPopupMessage('Invalid verification code!');
        }
      },
      error: (err) => {
        console.error('Verification error:', err);
        this.showPopupMessage('Error verifying code. Please try again!');
      }
    });
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}