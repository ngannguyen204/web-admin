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
  showPopup: boolean = false;
  popupMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  async onSubmit() {
    if (!this.email.trim()) {
      this.showPopupMessage('Please enter your email!');
      return;
    }

    this.isLoading = true;
    const normalizedEmail = this.email.toLowerCase().trim();

    try {
      await this.authService.forgotPassword(normalizedEmail).toPromise();
      
      localStorage.setItem('resetEmail', normalizedEmail);
      this.showPopupMessage('Password reset email sent successfully! Please check your inbox.');
      
      setTimeout(() => {
        this.router.navigate(['/confirm-code']);
      }, 3000);

    } catch (error: any) {
      console.error('Forgot password error:', error);
      this.showPopupMessage(error.message || 'Error processing your request');
    } finally {
      this.isLoading = false;
    }
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}